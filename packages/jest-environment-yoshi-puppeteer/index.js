const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');
const { WS_ENDPOINT_PATH } = require('./constants');

module.exports = class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    const browserWSEndpoint = await fs.readFile(WS_ENDPOINT_PATH, 'utf8');

    if (!browserWSEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    this.global.browser = await puppeteer.connect({
      browserWSEndpoint,
    });

    this.global.page = await this.global.browser.newPage();
  }

  async teardown() {
    await this.global.page.close();
  }
};
