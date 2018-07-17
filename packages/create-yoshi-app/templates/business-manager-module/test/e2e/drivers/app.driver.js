import { browser, ExpectedConditions, $ } from 'protractor';

const chance = require('chance');

export const appDriver = env => {
  const waitForVisibilityOf = async (element, timeout = 4000) => {
    await browser.wait(ExpectedConditions.visibilityOf(element), timeout);
    return element;
  };

  return {
    navigateToApp: async () => {
      const changeInstance = new chance.Chance();
      const metaSiteId = changeInstance.guid();
      await browser.get(
        await env.businessManager.getUrl(`${metaSiteId}/{%projectName%}`),
      );
    },
    getAppTitleText: async () => {
      return waitForVisibilityOf($('[data-hook="app-title"]')).then(e =>
        e.getText(),
      );
    },
  };
};
