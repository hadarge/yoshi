const { expect } = require('chai');
const stripAnsi = require('strip-ansi');

let depkeeperPresetYoshiMock;
const mockRequire = require('mock-require');

mockRequire('@wix/depkeeper-preset-yoshi', () => depkeeperPresetYoshiMock());
const depCheck = require('../../src/tasks/dep-check');

describe('haste-task-wix-dep-check', () => {
  afterEach(() => (depkeeperPresetYoshiMock = null));

  it('should show a warning when some dependencies are behind', async () => {
    depkeeperPresetYoshiMock = () =>
      Promise.resolve({
        fail: [],
        warn: [
          {
            name: 'wix-style-react',
            version: '1.0.0',
            minimal: '1.0.2',
            latest: '1.0.2',
          },
        ],
      });

    const message = [
      'WARNING: some dependencies are a bit behind:',
      'wix-style-react@1.0.0 should be @1.0.2',
    ].join('\n');

    const warning = await depCheck();
    expect(stripAnsi(warning)).to.equal(message);
  });

  it('should show an error when some dependencies must be updated', async () => {
    depkeeperPresetYoshiMock = () =>
      Promise.resolve({
        fail: [
          {
            name: 'wix-style-react',
            version: '1.0.0',
            minimal: '1.0.2',
            latest: '1.0.2',
          },
        ],
        warn: [],
      });

    const message = [
      'ERROR: the following dependencies must be updated:',
      'wix-style-react@1.0.0 must be at least @1.0.2',
    ].join('\n');

    const error = await invertPromise(depCheck);
    expect(stripAnsi(error)).to.equal(message);
  });

  function invertPromise(promise) {
    return new Promise((resolve, reject) => promise().then(reject, resolve));
  }
});
