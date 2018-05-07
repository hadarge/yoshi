const { merge } = require('lodash');
const { expect } = require('chai');
const retryPromise = require('retry-promise').default;

const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');
const { killSpawnProcessAndHisChildren } = require('./helpers/process');
const {
  migrateToScopedPackages,
  insideTeamCity,
  outsideTeamCity,
} = require('./helpers/env-variables');

describe('Migrate to scoped packages task', () => {
  let test, child, npm;

  before(() => startNpmServer(3400).then(ref => (npm = ref)));
  after(() => npm.instance.close());

  beforeEach(() => {
    test = tp.create();
    child = null;
    npm.app.set('exists', false);
    npm.app.set('packages', []);
  });

  afterEach(() => {
    if (test.stderr) {
      console.log(test.stderr);
    }
    test.teardown();
    return killSpawnProcessAndHisChildren(child);
  });

  it('should not change package name by default', () => {
    const pkg = JSON.parse(fx.packageJson());

    child = setup(test, JSON.stringify(pkg)).spawn('start', [], merge({}, outsideTeamCity));

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal(pkg.name);
    });
  });

  it('should change package name when feature toggle is on', () => {
    const pkg = JSON.parse(fx.packageJson());
    pkg.publishConfig = { registry: 'repo.dev.wix' };

    npm.app.set('exists', true);
    npm.app.set('packages', []);

    child = setup(test, JSON.stringify(pkg)).spawn(
      'start',
      [],
      merge({}, migrateToScopedPackages, outsideTeamCity),
    );

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal('@wix/' + pkg.name);
      expect(test.stderr).to.contain('WARNING: package.json has been updated');
    });
  });

  it('should allow enabling a feature through package.json', () => {
    const pkg = JSON.parse(fx.packageJson());
    pkg.publishConfig = { registry: 'repo.dev.wix' };
    pkg.migrateToScopedPackages = true;

    npm.app.set('exists', true);
    npm.app.set('packages', []);

    child = setup(test, JSON.stringify(pkg)).spawn('start', [], merge({}, outsideTeamCity));

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal('@wix/' + pkg.name);
      expect(test.stderr).to.contain('WARNING: package.json has been updated');
    });
  });

  it('should allow disabling a feature through package.json', () => {
    const pkg = JSON.parse(fx.packageJson());
    pkg.publishConfig = { registry: 'repo.dev.wix' };
    pkg.migrateToScopedPackages = false;

    npm.app.set('exists', true);
    npm.app.set('packages', []);

    child = setup(test, JSON.stringify(pkg)).spawn(
      'start',
      [],
      merge({}, migrateToScopedPackages, outsideTeamCity),
    );

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal(pkg.name);
      expect(test.stderr).to.not.contain('WARNING: package.json has been updated');
    });
  });

  it('should not change package name when run inside teamcity', () => {
    const pkg = JSON.parse(fx.packageJson());
    pkg.publishConfig = { registry: 'repo.dev.wix' };

    npm.app.set('exists', true);
    npm.app.set('packages', []);

    child = setup(test, JSON.stringify(pkg)).spawn(
      'start',
      [],
      merge({}, migrateToScopedPackages, insideTeamCity),
    );

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal(pkg.name);
    });
  });

  it('should not change package name if its already scoped', () => {
    const pkg = JSON.parse(fx.packageJson());
    pkg.name = '@wix/a';
    pkg.publishConfig = { registry: 'repo.dev.wix' };

    npm.app.set('exists', true);
    npm.app.set('packages', []);

    child = setup(test, JSON.stringify(pkg)).spawn(
      'start',
      [],
      merge({}, migrateToScopedPackages, outsideTeamCity),
    );

    return waitUntilStarted(test).then(() => {
      expect(readPackage(test).name).to.equal('@wix/a');
    });
  });

  it('should update scoped dependencies', () => {
    const outdatedDeps = {
      '@not-wix-prefix/react': 'latest',
      '@wix/utils': 'latest',
      'not-at-wix': 'latest',
      'at-wix': 'latest',
    };

    const pkg = JSON.parse(fx.packageJson());
    pkg.publishConfig = { registry: 'repo.dev.wix' };
    pkg.dependencies = outdatedDeps;
    pkg.devDependencies = outdatedDeps;
    pkg.peerDependencies = outdatedDeps;

    npm.app.set('exists', true);
    npm.app.set('packages', ['@wix/at-wix']);

    child = setup(test, JSON.stringify(pkg)).spawn(
      'start',
      [],
      merge({}, migrateToScopedPackages, outsideTeamCity),
    );

    return waitUntilStarted(test).then(() => {
      const updatedPkg = readPackage(test);
      const updatedDeps = {
        '@not-wix-prefix/react': 'latest',
        '@wix/utils': 'latest',
        'not-at-wix': 'latest',
        '@wix/at-wix': 'latest',
      };
      expect(updatedPkg.name).to.equal('@wix/' + pkg.name);
      expect(updatedPkg.dependencies).to.deep.equal(updatedDeps);
      expect(updatedPkg.devDependencies).to.deep.equal(updatedDeps);
      expect(updatedPkg.peerDependencies).to.deep.equal(updatedDeps);
    });
  });
});

function readPackage(test) {
  return JSON.parse(test.content('package.json'));
}

function waitUntilStarted(test) {
  return retryPromise({ backoff: 200 }, () => {
    return test.contains('target/server.log')
      ? Promise.resolve()
      : Promise.reject(new Error('Start command failed to complete'));
  });
}

function setup(test, packageJson) {
  return test.setup({
    '.npmrc': [
      'registry=http://localhost:3400/',
      'always-auth=false',
      '@wix:registry=http://localhost:3400/',
      '//localhost:3400/:always-auth=false',
    ].join('\n'),
    'src/test.spec.js': '',
    'src/client.js': '',
    'entry.js': '',
    'package.json': packageJson,
    'pom.xml': fx.pom(),
  });
}

function startNpmServer(port) {
  const express = require('express');
  const app = express();

  app.get('/:name', (req, res, next) => {
    app.get('exists') ? next() : res.sendStatus(404);
  });

  app.get('/:name', (req, res) => {
    res.json({
      name: req.params.name,
      'dist-tags': {
        latest: '1.0.0',
      },
      versions: {
        '1.0.0': {
          name: req.params.name,
          description: '',
          version: '1.0.0',
          main: 'index.js',
          files: ['index.js'],
          scripts: {
            build: ':',
          },
        },
      },
      time: {
        created: '2017-10-06T18:01:18.652Z',
        modified: '2017-10-08T15:57:03.368Z',
        '1.0.0': '2017-10-06T18:01:18.652Z',
      },
      wix: app.get('packages'),
    });
  });

  return new Promise(resolve => {
    const instance = app.listen(port, () => resolve({ app, instance }));
  });
}
