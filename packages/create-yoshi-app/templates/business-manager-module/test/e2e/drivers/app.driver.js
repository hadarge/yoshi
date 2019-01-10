const chance = require('chance');

export const appDriver = () => {
  const waitForVisibilityOf = async selector => {
    return page.waitForSelector(selector);
  };

  return {
    navigateToApp: async () => {
      const changeInstance = new chance.Chance();
      const metaSiteId = changeInstance.guid();
      await page.goto(
        await testKitEnv.getUrl(`${metaSiteId}/{%projectName%}`),
      );
    },
    getAppTitleText: async () => {
      await waitForVisibilityOf('h2');
      return page.$eval('h2', e => e.innerText);
    },
    waitForSelector: waitForVisibilityOf,
  };
};
