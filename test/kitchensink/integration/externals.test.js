const { initTest } = require('../../utils');

describe('externals', () => {
  it('configures dependencies as external', async () => {
    await initTest('externals');

    const result = await page.$eval('#externals', elm => elm.textContent);

    expect(result).toBe('Some external text.');
  });
});
