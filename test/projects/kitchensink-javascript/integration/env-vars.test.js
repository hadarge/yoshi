const { initTest } = require('../../../utils');

describe('env vars', () => {
  it('supports NODE_ENV', async () => {
    await initTest('env-vars');

    const result = await page.$eval(
      '#env-vars #node-env',
      elm => elm.textContent,
    );

    if (global.__DEV__) {
      expect(result).toEqual('development');
    } else {
      expect(result).toEqual('production');
    }
  });

  it('supports __CI_APP_VERSION__', async () => {
    await initTest('env-vars');

    const result = await page.$eval(
      '#env-vars #ci-app-version',
      elm => elm.textContent,
    );

    if (global.__DEV__) {
      expect(result).toEqual('0.0.0');
    } else {
      expect(result).toEqual('1.0.0-SNAPSHOT');
    }
  });
});
