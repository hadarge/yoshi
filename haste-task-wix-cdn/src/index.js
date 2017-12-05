const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const {decorate} = require('./server-api');
const {shouldRunWebpack, filterNoise} = require('./utils');

module.exports = ({
  port,
  ssl,
  host,
  publicPath,
  statics,
  webpackConfigPath,
  configuredEntry,
  defaultEntry,
} = {host: 'localhost', port: '3000'}) => () => {
  return new Promise((resolve, reject) => {
    let middlewares = [];

    if (webpackConfigPath) {
      const getConfig = require(webpackConfigPath);
      const webpackConfig = getConfig({debug: true, disableModuleConcatenation: true});

      if (shouldRunWebpack(webpackConfig, defaultEntry, configuredEntry)) {
        webpackConfig.entry = addHotEntries(webpackConfig.entry);
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.output.publicPath = publicPath;

        const bundler = filterNoise(webpack(webpackConfig));

        middlewares = [
          webpackDevMiddleware(bundler, {quiet: true}),
          webpackHotMiddleware(bundler, {log: null})
        ];
      }
    }

    const app = express();

    decorate({app, middlewares, host, port, statics});

    const serverFactory = ssl ? httpsServer(app) : app;

    serverFactory.listen(port, host, err =>
      err ? reject(err) : resolve());
  });
};

function addHotEntries(entries) {
  return Object.keys(entries).reduce((acc, value) => {
    acc[value] = [
      `${require.resolve('webpack-hot-middleware/client')}?dynamicPublicPath=true&path=__webpack_hmr`
    ].concat(entries[value]);
    return acc;
  }, {});
}

function sslCredentials(keyPath, certificatePath, passphrase) {
  const privateKey = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
  const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath), 'utf8');

  return {
    key: privateKey,
    cert: certificate,
    passphrase
  };
}

function httpsServer(app) {
  const credentials = sslCredentials('../assets/key.pem', '../assets/cert.pem', '1234');
  return https.createServer(credentials, app);
}
