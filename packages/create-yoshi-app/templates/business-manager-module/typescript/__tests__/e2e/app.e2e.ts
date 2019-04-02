import { appDriver } from './drivers/app.driver';

describe('React application', () => {
  let driver;

  beforeEach(() => {
    driver = appDriver();
  });

  it('should display title', async () => {
    await driver.navigateToApp();
    await driver.waitForSelector('h2');

    expect(await driver.getAppTitleText()).toEqual('Hello World!');
  });
});
