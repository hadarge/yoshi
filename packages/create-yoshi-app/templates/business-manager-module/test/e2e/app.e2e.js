import { expect } from 'chai';
import { appDriver } from './drivers/app.driver';
import { environment } from '../environment';

describe('load app inside biz mgr', () => {
  let env;
  let driver;

  before(async () => {
    env = await environment();
    driver = appDriver(env);
    await env.start();
  });
  after(() => env.stop());

  it('should render app', async () => {
    await driver.navigateToApp();
    expect(await driver.getAppTitleText()).to.equal('Hello World!');
  });
});
