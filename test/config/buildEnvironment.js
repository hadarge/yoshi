const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { parastorageCdnUrl, localCdnUrl } = require('../constants');

module.exports = class BuildEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    this.global.__DEV__ = false;

    this.global.page.setDefaultNavigationTimeout(10000);

    await redirectParastorageToLocal(this.global.page);
  }
};

async function redirectParastorageToLocal(page) {
  // We are using raw CDP because of in issue in pptr
  // that is not allowing us to send requests from workers
  // when "request interception" is enabled
  // https://github.com/GoogleChrome/puppeteer/issues/2781
  const cdp = await page.target().createCDPSession();

  await cdp.send('Network.setRequestInterception', {
    patterns: [{ urlPattern: `${parastorageCdnUrl}/*` }],
  });

  await cdp.on(
    'Network.requestIntercepted',
    async ({ interceptionId, request }) => {
      await cdp.send('Network.continueInterceptedRequest', {
        interceptionId,
        url: request.url.replace(parastorageCdnUrl, localCdnUrl),
      });
    },
  );
}
