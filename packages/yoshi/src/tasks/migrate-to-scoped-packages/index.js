const fs = require('fs');
const childProcess = require('child_process');
const chalk = require('chalk');
const { isEmpty } = require('lodash');
const {
  inTeamCity,
  writeFile,
  migrateToScopedPackages,
} = require('yoshi-helpers');

const NOTICE = `
WARNING: package.json has been updated
Please read more here: https://github.com/wix-private/feds/blob/master/migrate-to-scoped-packages.md
`;

module.exports = () => {
  return validate()
    .then(names => ({
      pkg: readPackage(),
      names,
      changes: {},
    }))
    .then(payload => updatePackageName(payload))
    .then(payload => updateDependencies(payload, 'dependencies'))
    .then(payload => updateDependencies(payload, 'devDependencies'))
    .then(payload => updateDependencies(payload, 'peerDependencies'))
    .then(payload => updateDependencies(payload, 'optionalDependencies'))
    .then(
      payload =>
        isEmpty(payload.changes)
          ? Promise.reject('No changes detected')
          : payload,
    )
    .then(payload => {
      writeFile('package.json', JSON.stringify(payload.pkg, null, 2));
      console.warn(chalk.red(NOTICE));
    })
    .catch(error => {
      if (inTeamCity()) {
        console.error('Migration task failed:', error);
      }
    });
};

function validate() {
  return [
    () => (inTeamCity() ? Promise.reject('Running inside CI') : true),
    () => isFeatureTurnedOn(),
    () =>
      npm(
        'view --silent --progress=false --fetch-retries=0 --cache-min=0 --json @wix/scopes@latest wix',
      )
        .then(stdout => JSON.parse(stdout))
        .catch(() => Promise.reject('@wix/scopes not found')),
  ].reduce((acc, curr) => acc.then(curr), Promise.resolve());
}

function isFeatureTurnedOn() {
  const pkg = readPackage();
  if (pkg.migrateToScopedPackages === false) {
    return Promise.reject('Feature is turned off');
  }
  if (pkg.migrateToScopedPackages !== true && !migrateToScopedPackages()) {
    return Promise.reject('Feature is not turned on');
  }
  return Promise.resolve();
}

function updatePackageName(payload) {
  const { pkg, changes } = payload;
  const update = [
    !pkg.private,
    !pkg.name.startsWith('@'),
    ((pkg.publishConfig || {}).registry || '').indexOf('repo.dev.wix') >= 0,
  ].every(truthy => truthy);
  if (update) {
    changes[pkg.name] = `@wix/${pkg.name}`;
    pkg.name = changes[pkg.name];
  }
  return payload;
}

function updateDependencies(payload, type) {
  const { pkg, changes, names } = payload;

  const deps = Object.keys(pkg[type] || {})
    .filter(name => !name.startsWith('@'))
    .filter(name => names.includes(`@wix/${name}`));

  deps.forEach(name => {
    changes[name] = `@wix/${name}`;
    pkg[type][`@wix/${name}`] = pkg[type][name];
    delete pkg[type][name];
  });

  return payload;
}

function readPackage() {
  return JSON.parse(fs.readFileSync('package.json').toString());
}

function npm(params) {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      ['npm', params].join(' '),
      { maxBuffer: 1024 * 1024 },
      (error, stdout) => {
        error ? reject(error) : resolve(stdout);
      },
    );
  });
}
