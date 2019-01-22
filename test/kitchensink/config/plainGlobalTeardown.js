const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');

module.exports = async globalConfig => {
  await teardownPuppeteer(globalConfig);
};
