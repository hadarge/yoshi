const { initTest } = require('../../../utils');

jest.setTimeout(30 * 1000);

describe('simple', () => {
  it('use case with yoshi-server', async () => {
    await initTest('/app');

    await page.waitForSelector('h1');
    await page.waitForSelector('h2');

    expect(await page.$eval('h1', elm => elm.textContent)).toBe('world! 5');
    expect(await page.$eval('h2', elm => elm.textContent)).toBe(
      'hello world! 12',
    );
  });
});
