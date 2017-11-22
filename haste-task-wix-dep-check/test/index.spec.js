'use strict';

const {expect} = require('chai');
const shmock = require('shmock');
const stripAnsi = require('strip-ansi');
const tp = require('test-phases');
const deps = require('../src');

describe('haste-check-deps', () => {
  let test, task;
  const port = 3333;
  const npmServer = shmock(port);

  beforeEach(() => {
    test = tp.create();
    task = deps({cwd: test.tmp});
  });

  afterEach(() => {
    test.teardown();
    npmServer.clean();
  });

  after(() => npmServer.close());

  it('should show a warning when haste-preset-yoshi & wix-style-react is at least 1 patch version behind', () => {
    // TODO: use more complex version, like installed - 1.5.2, latest - 1.6.0
    setupProject();
    mockMeta('haste-preset-yoshi', ['1.0.0', '1.0.1']);
    mockMeta('wix-style-react', ['1.0.0', '1.0.2']);

    const message = [
      'WARNING: some dependencies are a bit behind:',
      'haste-preset-yoshi@1.0.0 should be @1.0.1',
      'wix-style-react@1.0.0 should be @1.0.2'
    ].join('\n');

    return task().then(warning =>
      expect(stripAnsi(warning)).to.equal(message));
  });

  it('should show a warning when haste-preset-yoshi & wix-style-react is at least 1 version behind', () => {
    setupProject();
    mockMeta('haste-preset-yoshi', ['1.0.0', '2.0.0']);
    mockMeta('wix-style-react', ['1.0.0', '1.1.0']);

    const message = [
      'WARNING: some dependencies are a bit behind:',
      'haste-preset-yoshi@1.0.0 should be @2.0.0',
      'wix-style-react@1.0.0 should be @1.1.0'
    ].join('\n');

    return task().then(warning =>
      expect(stripAnsi(warning)).to.equal(message));
  });

  it('should throw an error when haste-preset-yoshi is 2 major versions behind', () => {
    setupProject();
    mockMeta('haste-preset-yoshi', ['1.0.0', '2.0.0', '3.0.0', '4.0.0']);

    const message = [
      'ERROR: the following dependencies must be updated:',
      'haste-preset-yoshi@1.0.0 must be at least @3.0.0'
    ].join('\n');

    return invertPromise(task()).then(error =>
      expect(stripAnsi(error)).to.equal(message));
  });

  it('should show nothing if haste-preset-yoshi & wix-style-react is up to date', () => {
    setupProject();
    mockMeta('haste-preset-yoshi', '1.0.0');
    mockMeta('wix-style-react', '1.0.0');

    return task().then(message =>
      expect(message).to.be.undefined);
  });

  function setupProject() {
    return test.setup({
      '.npmrc': `registry=http://localhost:${port}/`,
      'package.json': '{"devDependencies": {"haste-preset-yoshi": "1.0.0"}, "dependencies": {"wix-style-react": "1.0.0"}}',
      'node_modules/haste-preset-yoshi/package.json': '{"name": "haste-preset-yoshi", "version": "1.0.0"}',
      'node_modules/wix-style-react/package.json': '{"name": "wix-style-react", "version": "1.0.0"}'
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
      promise.then(reject, resolve));
  }
});
