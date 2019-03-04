const PuppeteerEnvironment = require('jest-environment-puppeteer');

module.exports = class PlainEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    this.global.page.setDefaultNavigationTimeout(10000);

    this.global.__DEV__ = true;
  }
};
