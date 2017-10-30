const express = require('express');
const projectConfig = require('../config/project');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

function sslCredentials(keyPath, certificatePath, passphrase) {
  const privateKey = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
  const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath), 'utf8');

  return {
    key: privateKey,
    cert: certificate,
    passphrase
  };
}

function corsMiddleware() {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  };
}

function resourceTimingMiddleware() {
  return (req, res, next) => {
    res.setHeader('Timing-Allow-Origin', '*');
    next();
  };
}

function httpsServer(app) {
  const credentials = sslCredentials('../config/key.pem', '../config/cert.pem', '1234');
  return https.createServer(credentials, app);
}

function redirectMiddleware(hostname, port) {
  return (req, res, next) => {
    if (!/\.min\.(js|css)/.test(req.originalUrl)) {
      return next();
    }

    const httpModule = req.protocol === 'http' ? http : https;

    const options = {
      port,
      hostname,
      path: req.originalUrl.replace('.min', ''),
      rejectUnauthorized: false,
    };

    const request = httpModule.request(options, proxy => proxy.pipe(res));

    request.on('error', () => next()).end();
  };
}

const decorate = ({app, middlewares = [], host}) => {
  const port = projectConfig.servers.cdn.port();
  const files = projectConfig.clientFilesPath();

  [
    corsMiddleware(),
    resourceTimingMiddleware(),
    express.static(files),
    ...middlewares,
    redirectMiddleware(host, port)
  ]
  .forEach(mw => app.use(mw));

  return app;
};

const start = ({middlewares, host}) => {
  const port = projectConfig.servers.cdn.port();
  const ssl = projectConfig.servers.cdn.ssl();
  const app = express();

  decorate({app, middlewares, host});

  return new Promise((resolve, reject) => {
    const serverFactory = ssl ? httpsServer(app) : app;
    const server = serverFactory.listen(port, host, err =>
      err ? reject(err) : resolve(server));
  });
};

module.exports = {start, decorate};
