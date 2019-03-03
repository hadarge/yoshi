const PuppeteerEnvironment = require('jest-environment-puppeteer');

module.exports = class PlainEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEV__ = true;
  }
};
