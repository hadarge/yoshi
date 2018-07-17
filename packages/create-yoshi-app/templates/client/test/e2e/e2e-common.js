import puppeteer from 'puppeteer';
import { start } from '../dev/server';

before(async () => {
  await start(3100);
  global.browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
});

after(async () => {
  await global.browser.close();
});

export const baseURL = `http://localhost:3100`;
