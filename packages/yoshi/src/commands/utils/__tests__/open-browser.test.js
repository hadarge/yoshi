jest.mock('react-dev-utils/openBrowser');

const openBrowser = require('../open-browser');
const originalOpenBrowserMock = require('react-dev-utils/openBrowser');

const url1 = 'https://url1.com';
const url2 = 'https://url2.com';

beforeEach(() => {
  originalOpenBrowserMock.mockClear();
});

test('open browser supports a string of 1 url', () => {
  openBrowser(url1);
  expect(originalOpenBrowserMock).toHaveBeenCalledWith('https://url1.com');
});

test('open browser supports a string with urls separated by commas', () => {
  openBrowser(`${url1}, ${url2}`);
  expect(originalOpenBrowserMock).toHaveBeenCalledWith('https://url1.com');
  expect(originalOpenBrowserMock).toHaveBeenNthCalledWith(
    2,
    'https://url2.com',
  );
});

test('open browser supports an array of urls', () => {
  openBrowser([url1, url2]);
  expect(originalOpenBrowserMock).toHaveBeenCalledWith('https://url1.com');
  expect(originalOpenBrowserMock).toHaveBeenNthCalledWith(
    2,
    'https://url2.com',
  );
});
