const {expect} = require('chai');
const shmock = require('shmock');
const stripAnsi = require('strip-ansi');
const tp = require('test-phases');
const deps = require('../src/');


describe('haste-task-wix-dep-check', () => {
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
    setupProject();
    mockMeta('wix-style-react', ['1.0.0', '1.0.2']);
    mockMeta('haste-preset-yoshi', ['1.0.0', '1.0.1']);

    const message = [
      'WARNING: some dependencies are a bit behind:',
      'wix-style-react@1.0.0 should be @1.0.2',
      'haste-preset-yoshi@1.0.0 should be @1.0.1'
    ].join('\n');

    return task().then(warning =>
      expect(stripAnsi(warning)).to.equal(message));
  });

  it('should show a warning when haste-preset-yoshi & wix-style-react is at least 1 version behind', () => {
    setupProject();
    mockMeta('wix-style-react', ['1.0.0', '1.1.0']);
    mockMeta('haste-preset-yoshi', ['1.0.0', '2.0.0']);

    const message = [
      'WARNING: some dependencies are a bit behind:',
      'wix-style-react@1.0.0 should be @1.1.0',
      'haste-preset-yoshi@1.0.0 should be @2.0.0'
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

  it('should throw an error when wix-style-react is 2 major versions behind', () => {
    setupProject();
    mockMeta('wix-style-react', ['1.0.0', '1.1.0', '2.0.0', '2.1.0', '3.0.0']);

    const message = [
      'ERROR: the following dependencies must be updated:',
      'wix-style-react@1.0.0 must be at least @2.0.0'
    ].join('\n');

    return invertPromise(task())
      .then(error => expect(stripAnsi(error)).to.equal(message));
  });

  it('should show nothing if haste-preset-yoshi & wix-style-react is up to date', () => {
    setupProject();
    mockMeta('wix-style-react', '1.0.0');
    mockMeta('haste-preset-yoshi', '1.0.0');

    return task().then(message =>
      expect(message).to.be.undefined);
  });

  function setupProject() {
    return test.setup({
      '.npmrc': `registry=http://localhost:${port}/`,
      'package.json': '{"dependencies": {"wix-style-react": "1.0.0"}, "devDependencies": {"haste-preset-yoshi": "1.0.0"}}',
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
