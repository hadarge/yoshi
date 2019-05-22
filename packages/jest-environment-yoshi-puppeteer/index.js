const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const { WS_ENDPOINT_PATH } = require('./constants');
const { setupRequireHooks } = require('yoshi-helpers/require-hooks');
const loadJestYoshiConfig = require('yoshi-config/jest');

// the user's config is loaded outside of a jest runtime and should be transpiled
// with babel/typescript, this may be run separately for every worker
setupRequireHooks();

const jestYoshiConfig = loadJestYoshiConfig();

const ParentEnvironment = jestYoshiConfig.bootstrap
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

    this.global.page.setDefaultTimeout(5000);

    this.global.page.setDefaultNavigationTimeout(5000);

    this.global.page.on('pageerror', error => {
      console.warn(`Puppeteer page error: ${error.message}`);
      console.warn(error.stack);
    });
  }

  async teardown() {
    await this.global.page.close();
    await super.teardown();
  }
};
