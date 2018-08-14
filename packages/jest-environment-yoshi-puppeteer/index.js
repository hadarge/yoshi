const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const { WS_ENDPOINT_PATH } = require('./constants');
const { loadConfig } = require('yoshi/src/utils');

const config = loadConfig();

const ParentEnvironment = config.bootstrap
  ? require('jest-environment-yoshi-bootstrap')
  : require('jest-environment-node');

module.exports = class PuppeteerEnvironment extends ParentEnvironment {
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
