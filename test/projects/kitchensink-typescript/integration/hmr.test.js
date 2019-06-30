const fs = require('fs');
const path = require('path');
const waitForExpect = require('wait-for-expect');

const { initTest, waitForPort, waitForPortToFree } = require('../../../utils');

jest.setTimeout(30 * 1000);

const clientFilePath = path.join(
  process.env.TEST_DIRECTORY,
  'src/components/features/css-inclusion.tsx',
);

const serverFilePath = path.join(process.env.TEST_DIRECTORY, 'src/server.tsx');

const workerFilePath = path.join(process.env.TEST_DIRECTORY, 'src/worker.ts');

const originalServerContent = fs.readFileSync(serverFilePath, 'utf-8');

describe.skip('hmr', () => {
  describe('client side', () => {
    it('reloads the browser on javascript changes', async () => {
      await initTest('css-inclusion');

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'CSS Modules are working!',
      );

      const originalContent = fs.readFileSync(clientFilePath, 'utf-8');

      const editedContent = originalContent.replace(
        'CSS Modules are working!',
        'Overridden content!',
      );

      fs.writeFileSync(clientFilePath, editedContent);

      await page.waitForNavigation();

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'Overridden content!',
      );

      fs.writeFileSync(clientFilePath, originalContent);

      await page.waitForNavigation();

      expect(await page.$eval('#css-inclusion', elm => elm.textContent)).toBe(
        'CSS Modules are working!',
      );
    });
  });

  describe('server side', () => {
    afterEach(async () => {
      fs.writeFileSync(serverFilePath, originalServerContent);

      await waitForPort(process.env.PORT);

      await page.waitForNavigation();

      expect(await page.title()).toBe('Some title');
    });

    it('reloads server on changes and reloads the browser', async () => {
      await initTest('css-inclusion');

      expect(await page.title()).toBe('Some title');

      fs.writeFileSync(
        serverFilePath,
        originalServerContent.replace('Some title', 'Overridden title!'),
      );

      await page.waitForNavigation();

      expect(await page.title()).toBe('Overridden title!');
    });

    it('shows error overlay on the browser', async () => {
      await initTest('css-inclusion');

      expect(await page.title()).toBe('Some title');

      fs.writeFileSync(serverFilePath, '<<< error');

      await page.waitForSelector('#webpack-dev-server-client-overlay');
    });

    it('restarts server if it dies', async () => {
      await initTest('css-inclusion');

      expect(await page.title()).toBe('Some title');

      fs.writeFileSync(serverFilePath, 'process.exit(1);');

      await waitForPortToFree(process.env.PORT);
    });
  });

  describe('web worker side', () => {
    it('refresh the browser after changes in the web-worker', async () => {
      const originalLog = 'hello from a web worker';
      const overriddenLog = 'hello from the other side';

      const logs = [];

      page.on('console', msg => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await initTest('web-worker');

      await waitForExpect(() => {
        expect(logs).toContain(originalLog);
      });

      logs.length = 0;

      // change worker file to contain different log
      const originalContent = fs.readFileSync(workerFilePath, 'utf-8');
      const editedContent = originalContent.replace(originalLog, overriddenLog);
      fs.writeFileSync(workerFilePath, editedContent);

      // wait for a refresh & new log in the console
      await page.waitForNavigation();
      await waitForExpect(() => {
        expect(logs).toContain(overriddenLog);
      });

      logs.length = 0;

      // revert the change
      fs.writeFileSync(workerFilePath, originalContent);

      // wait for a refresh & back to original log
      await page.waitForNavigation();
      await waitForExpect(() => {
        expect(logs).toContain(originalLog);
      });
    });

    it('shows error overlay on the browser, and can also recover from an error', async () => {
      // There is a jest-puppeteer listener that throws an error in case there is
      // a runtime error in the page. while this is generally a good thing,
      // in this tests we create a runtime error and don't want the browser to exit
      // we want to remove the listener, but only from this test, therefore the hack below
      // https://github.com/smooth-code/jest-puppeteer/blob/85a1122c3cb970b5b7979af7e6900eeb23c20c86/packages/jest-environment-puppeteer/src/PuppeteerEnvironment.js#L109
      page.removeAllListeners();

      // change worker file to contain something that will raise a compilation error
      const originalContent = fs.readFileSync(workerFilePath, 'utf-8');
      fs.writeFileSync(workerFilePath, '>>>error');

      await initTest('web-worker');

      await page.waitForSelector('#webpack-dev-server-client-overlay');

      // revert the change
      fs.writeFileSync(workerFilePath, originalContent);

      // wait for a refresh
      await page.waitForNavigation();

      // After we've removed the listeners from the page,
      // we reset the page to not effect other tests
      await jestPuppeteer.resetPage(); // eslint-disable-line
    });
  });
});
