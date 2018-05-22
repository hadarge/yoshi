const dargs = require('dargs');
const crossSpawn = require('cross-spawn');

const protractor = (debugPort, debugBrkPort) => {
  // Only install specific version of chrome driver in CI, install latest locally
  const webdriverManagerOptions = !!process.env.IS_BUILD_AGENT // eslint-disable-line no-extra-boolean-cast
    ? { 'versions.chrome': process.env.CHROMEDRIVER_VERSION || '2.29' }
    : {};

  const configPath = require.resolve('../../../config/protractor.conf.js');
  const defaultWebdriverOptions = { standalone: true, gecko: 'false' };
  const dargsSettings = {
    allowCamelCase: true,
    useEquals: false,
    ignoreFalse: false,
  };

  const webdriverArgs = dargs(
    { ...defaultWebdriverOptions, ...webdriverManagerOptions },
    dargsSettings,
  );
  const protractorArgs = [...dargs(dargsSettings), configPath];

  const PROTRACTOR_BIN = require.resolve('protractor/bin/protractor');
  protractorArgs.unshift(PROTRACTOR_BIN);

  if (!!debugBrkPort) {
    protractorArgs.unshift(`--inspect-brk=${debugBrkPort}`);
  } else if (!!debugPort) {
    protractorArgs.unshift(`--inspect=${debugPort}`);
  }
  const WEBDRIVER_BIN = require.resolve('protractor/bin/webdriver-manager');
  return new Promise((resolve, reject) => {
    const webDriverUpdate = crossSpawn(
      WEBDRIVER_BIN,
      ['update', ...webdriverArgs],
      {
        stdio: 'inherit',
      },
    );
    webDriverUpdate.on('exit', () => {
      const protractor = crossSpawn('node', protractorArgs, {
        stdio: 'inherit',
      });
      protractor.on('exit', code => {
        code === 0
          ? resolve()
          : reject(`protractor failed with status code "${code}"`);
      });
    });
  });
};

module.exports = protractor;
