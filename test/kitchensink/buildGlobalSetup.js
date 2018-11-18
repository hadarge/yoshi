const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const Scripts = require('../scripts');

global.scripts = new Scripts(process.env.TEST_DIRECTORY);

module.exports = async () => {
  await setupPuppeteer();

  await global.scripts.build({
    // enable CI env vars
    BUILD_NUMBER: 1,
    TEAMCITY_VERSION: 1,
    ARTIFACT_VERSION: '1.0.0-SNAPSHOT',
  });

  global.result = await global.scripts.serve();
};
