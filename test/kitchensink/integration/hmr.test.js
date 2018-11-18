const fs = require('fs');
const path = require('path');
const { matchCSS, matchJS, initTest, request } = require('../../utils');

jest.setTimeout(10 * 1000);

describe('hmr', () => {
  describe('client side', () => {
    it('browser refresh on javascript change', async () => {
      const filePath = path.join(
        global.scripts.testDirectory,
        'src/components/features/css-inclusion.js',
      );

      await initTest('css-inclusion');

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'CSS Modules are working!',
      );

      const originalContent = fs.readFileSync(filePath, 'utf-8');

      const editedContent = originalContent.replace(
        'CSS Modules are working!',
        'Overridden content!',
      );

      fs.writeFileSync(filePath, editedContent);

      await page.waitForNavigation();

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'Overridden content!',
      );

      fs.writeFileSync(filePath, originalContent);

      await page.waitForNavigation();

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'CSS Modules are working!',
      );
    });
  });
});
