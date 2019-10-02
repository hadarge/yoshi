import chance from 'chance';

export const appDriver = () => {
  const waitForVisibilityOf = async (selector: string) => {
    return page.waitForSelector(selector);
  };

  return {
    navigateToApp: async () => {
      const chanceInstance = new chance.Chance();
      const metaSiteId = chanceInstance.guid();
      await page.goto(await testKitEnv.getUrl(`${metaSiteId}/{%projectName%}`));
    },
    getAppTitleText: async () => {
      await waitForVisibilityOf('h2');
      return page.$eval('h2', e => e.textContent);
    },
    waitForSelector: waitForVisibilityOf,
  };
};

export type AppDriver = ReturnType<typeof appDriver>;
