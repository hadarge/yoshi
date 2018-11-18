const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const Scripts = require('../scripts');

global.scripts = new Scripts(process.env.TEST_DIRECTORY);

module.exports = async () => {
  await setupPuppeteer();

  global.result = await global.scripts.start({
    // disable CI env vars
    BUILD_NUMBER: '',
    TEAMCITY_VERSION: '',
    ARTIFACT_VERSION: '',
  });
};
