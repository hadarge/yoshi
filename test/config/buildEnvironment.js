const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { parastorageCdnUrl, localCdnUrl } = require('../constants');

module.exports = class BuildEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEV__ = false;

    this.global.page.setDefaultNavigationTimeout(10000);

    await this.global.page.setRequestInterception(true);

    this.global.page.on('request', request => {
      const url = request.url();

      if (url.startsWith(parastorageCdnUrl)) {
        request.continue({
          url: url.replace(parastorageCdnUrl, localCdnUrl),
        });
      } else {
        request.continue();
      }
    });
  }
};
