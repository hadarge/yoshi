const os = require('os');
const http = require('http');
const execa = require('execa');
const waitPort = require('wait-port');
const stripAnsi = require('strip-ansi');
const { parastorageCdnUrl, localCdnUrl } = require('./constants');

const execaSafe = (...args) => {
  return execa(...args)
    .then(({ stdout, stderr, ...rest }) => ({
      fulfilled: true,
      rejected: false,
      stdout: stripAnsi(stdout),
      stderr: stripAnsi(stderr),
      ...rest,
    }))
    .catch(err => ({
      fulfilled: false,
      rejected: true,
      reason: err,
      stdout: '',
      stderr: stripAnsi(
        err.message
          .split(os.EOL)
          .slice(2)
          .join(os.EOL),
      ),
    }));
};

const makeRequest = url => {
  return new Promise(resolve => {
    http.get(url, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => resolve(rawData));
    });
  });
};

const request = url => {
  if (url.startsWith(parastorageCdnUrl)) {
    return makeRequest(url.replace(parastorageCdnUrl, localCdnUrl));
  }

  return makeRequest(url);
};

const matchCSS = async (chunkName, page, regexes) => {
  const url = await page.$$eval(
    'link',
    (links, name) => {
      return links
        .filter(link => link.rel === 'stylesheet')
        .map(link => link.href)
        .find(href => href.includes(name));
    },
    chunkName,
  );

  if (!url) {
    throw new Error(`Couldn't find stylesheet with the name "${chunkName}"`);
  }

  const content = (await request(url)).replace(/\s/g, '');

  for (const regex of regexes) {
    expect(content).toMatch(regex);
  }
};

const matchJS = async (chunkName, page, regexes) => {
  const url = await page.$$eval(
    'script',
    (scripts, name) => {
      return scripts.map(script => script.src).find(src => src.includes(name));
    },
    chunkName,
  );

  if (!url) {
    throw new Error(`Couldn't find script with the name "${chunkName}"`);
  }

  const content = (await request(url)).replace(/\s/g, '');

  for (const regex of regexes) {
    expect(content).toMatch(regex);
  }
};

async function waitForPort(port, { timeout = 10000 } = {}) {
  const portFound = await waitPort({ port, timeout, output: 'silent' });

  if (!portFound) {
    throw new Error(`Timed out waiting for "${port}".`);
  }
}

const initTest = async feature => {
  await page.goto(`http://localhost:3000/${feature}`);
};

module.exports = {
  request,
  matchJS,
  matchCSS,
  initTest,
  waitForPort,
  execaSafe,
};
