const { initTest } = require('../../utils');

describe('entries', () => {
  it('configures multiple entries', async () => {
    await initTest('other');

    const innerHTML = await page.$eval('#other', elm => elm.innerHTML);

    expect(innerHTML).toEqual('Other App');
  });
});
