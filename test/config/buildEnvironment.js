const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { localCdnUrl } = require('../constants');

module.exports = class BuildEnvironment extends PuppeteerEnvironment {
  constructor(config, context) {
    super(config, context);

    this.testEnvironmentOptions = config.testEnvironmentOptions;
  }

  async setup() {
    await super.setup();

    this.global.__DEV__ = false;

    this.global.page.setDefaultNavigationTimeout(10000);

    await this.redirectParastorageToLocal();
  }

  async redirectParastorageToLocal() {
    // We are using raw CDP because of in issue in pptr
    // that is not allowing us to send requests from workers
    // when "request interception" is enabled
    // https://github.com/GoogleChrome/puppeteer/issues/2781
    const cdp = await this.global.page.target().createCDPSession();

    await cdp.send('Network.setRequestInterception', {
      patterns: [
        { urlPattern: `${this.testEnvironmentOptions.parastorageCdnUrl}/*` },
      ],
    });

    await cdp.on(
      'Network.requestIntercepted',
      async ({ interceptionId, request }) => {
        await cdp.send('Network.continueInterceptedRequest', {
          interceptionId,
          url: request.url.replace(
            this.testEnvironmentOptions.parastorageCdnUrl,
            localCdnUrl,
          ),
        });
      },
    );
  }
};
