const {expect} = require('chai');
const shmock = require('shmock');
const stripAnsi = require('strip-ansi');
const tp = require('test-phases');
const deps = require('../src/');

describe('haste-task-wix-dep-check', () => {
  let test;
  const port = 3333;
  const npmServer = shmock(port);

  beforeEach(() => {
    test = tp.create();
  });

  afterEach(() => {
    test.teardown();
    npmServer.clean();
  });

  after(() => npmServer.close());

  context('haste-preset-yoshi & wix-style-react', () => {

    beforeEach(() => {
      setupProject(
        {'wix-style-react': '1.0.0'},
        {'haste-preset-yoshi': '1.0.0'}
      );
    });

    it('should show a warning when haste-preset-yoshi & wix-style-react is at least 1 patch version behind', async () => {
      mockMeta('wix-style-react', ['1.0.0', '1.0.2']);
      mockMeta('haste-preset-yoshi', ['1.0.0', '1.0.1']);

      const message = [
        'WARNING: some dependencies are a bit behind:',
        'wix-style-react@1.0.0 should be @1.0.2',
        'haste-preset-yoshi@1.0.0 should be @1.0.1'
      ].join('\n');

      const warning = await task();
      expect(stripAnsi(warning)).to.equal(message);
    });

    it('should show a warning when haste-preset-yoshi & wix-style-react is at least 1 version behind', async () => {
      mockMeta('wix-style-react', ['1.0.0', '1.1.0']);
      mockMeta('haste-preset-yoshi', ['1.0.0', '2.0.0']);

      const message = [
        'WARNING: some dependencies are a bit behind:',
        'wix-style-react@1.0.0 should be @1.1.0',
        'haste-preset-yoshi@1.0.0 should be @2.0.0'
      ].join('\n');

      const warning = await task();
      expect(stripAnsi(warning)).to.equal(message);
    });

    it('should throw an error when haste-preset-yoshi is 2 major versions behind', async () => {
      mockMeta('haste-preset-yoshi', ['1.0.0', '2.0.0', '3.0.0', '4.0.0']);

      const message = [
        'ERROR: the following dependencies must be updated:',
        'haste-preset-yoshi@1.0.0 must be at least @3.0.0'
      ].join('\n');

      const error = await invertPromise(task);
      expect(stripAnsi(error)).to.equal(message);
    });

    it('should throw an error when wix-style-react is 2 major versions behind', async () => {
      mockMeta('wix-style-react', ['1.0.0', '1.1.0', '2.0.0', '2.1.0', '3.0.0']);

      const message = [
        'ERROR: the following dependencies must be updated:',
        'wix-style-react@1.0.0 must be at least @2.0.0'
      ].join('\n');

      const error = await invertPromise(task);
      expect(stripAnsi(error)).to.equal(message);
    });

    it('should show nothing if haste-preset-yoshi & wix-style-react is up to date', async () => {
      mockMeta('wix-style-react', '1.0.0');
      mockMeta('haste-preset-yoshi', '1.0.0');

      const message = await task();
      expect(message).to.be.undefined;
    });

  });

  context('wix-bootstrap-*', () => {

    beforeEach(() => {
      setupProject(
        {'wix-bootstrap-ng': '1.0.0'},
        {'wix-bootstrap-testkit': '2.0.0'}
      );
    });

    it('should show a warning for a wix-bootstrap-* dependency that is at least 10 patch version behind', async () => {
      mockMeta('wix-bootstrap-ng', ['1.0.0', '1.0.2']);
      mockMeta('wix-bootstrap-testkit', [...Array(7).keys()].map(i => `2.0.${i}`));

      const message = [
        'WARNING: some dependencies are a bit behind:',
        'wix-bootstrap-testkit@2.0.0 should be @2.0.1'
      ].join('\n');

      const warning = await task();
      expect(stripAnsi(warning)).to.equal(message);
    });

    it('must be at least noop if wix-bootstrap-* deps are up-to-date', async () => {
      mockMeta('wix-bootstrap-ng', ['1.0.0', '1.0.0']);
      mockMeta('wix-bootstrap-testkit', ['2.0.0', '2.0.0']);

      const warning = await task();
      expect(stripAnsi(warning)).to.equal(undefined);
    });
  });

  function setupProject(deps, devDeps) {
    const joinedDeps = Object.assign({}, deps, devDeps);
    const modules = Object.keys(joinedDeps).reduce((acc, current) => {
      acc[`node_modules/${current}/package.json`] = `{"name": "${current}", "version": "${joinedDeps[current]}"}`;
      return acc;
    }, {});

    return test.setup({
      '.npmrc': `registry=http://localhost:${port}/`,
      'package.json': JSON.stringify({dependencies: deps, devDependencies: devDeps}),
      ...modules
    });
  }

  function mockMeta(name, versions) {
    versions = [].concat(versions);
    npmServer.get(`/${name}`).reply(200, {
      _id: name,
      name,
      'dist-tags': {latest: versions.slice().pop()},
      versions: versions.reduce((acc, ver) => {
        acc[ver] = {};
        return acc;
      }, {})
    });
  }

  function invertPromise(promise) {
    return new Promise((resolve, reject) =>
      promise().then(reject, resolve));
  }

  function task() {
    return deps({cwd: test.tmp});
  }

});
