const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const Scripts = require('../scripts');

global.scripts = new Scripts(process.env.TEST_DIRECTORY);

module.exports = async () => {
  await setupPuppeteer();
};
