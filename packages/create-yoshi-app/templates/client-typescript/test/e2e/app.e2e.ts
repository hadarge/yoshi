import { expect } from 'chai';
import { baseURL } from './e2e-common';

describe('React application', () => {
  describe('open page', () => {
    it('should display title', async () => {
      const page = await browser.newPage();
      await page.goto(baseURL);
      await page.waitForSelector('h2', { timeout: 1000 });
      expect(await page.$eval('h2', e => e.innerText)).to.equal('Hello World!');
    });
  });
});
