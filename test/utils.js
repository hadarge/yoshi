const net = require('net');
const http = require('http');
const retry = require('async-retry');
const waitPort = require('wait-port');
const { parastorageCdnUrl, localCdnUrl } = require('./constants');

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

async function waitForPort(port, { timeout = 20000 } = {}) {
  const portNumber = parseInt(port, 10);

  const portFound = await waitPort({
    port: portNumber,
    timeout,
    output: 'silent',
  });

  if (!portFound) {
    throw new Error(`Timed out waiting for "${portNumber}".`);
  }
}

const initTest = async feature => {
  await page.goto(getUrl(feature));
};

const getUrl = path => {
  return `http://localhost:${process.env.PORT}/${path}`;
};

function isPortTaken(port) {
  return new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once('error', err => {
        err.code !== 'EADDRINUSE' ? reject(err) : resolve(true);
      })
      .once('listening', () => {
        tester
          .once('close', () => {
            resolve(false);
          })
          .close();
      })
      .listen(port);
  });
}

function waitForPortToFree(port) {
  return retry(async () => {
    expect(await isPortTaken(port)).toEqual(false);
  });
}

function waitForStdout(spawnedProcess, stringToMatch) {
  new Promise(resolve => {
    spawnedProcess.stdout.on('data', function listener(buffer) {
      if (buffer.toString().includes(stringToMatch)) {
        spawnedProcess.stdout.off('data', listener);
        resolve();
      }
    });
  });
}

module.exports = {
  request,
  matchJS,
  matchCSS,
  initTest,
  getUrl,
  waitForPort,
  waitForPortToFree,
  waitForStdout,
};
