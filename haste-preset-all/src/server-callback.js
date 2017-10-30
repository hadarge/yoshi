const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const {decorate} = require('./server-api');
const getConfig = require('../config/webpack.config.client');
const {shouldRunWebpack, filterNoise} = require('./utils');
const {servers} = require('../config/project');

module.exports = app => {
  const webpackConfig = getConfig({debug: true, disableModuleConcatenation: true});

  let middlewares = [];

  if (shouldRunWebpack(webpackConfig)) {
    webpackConfig.entry = addHotEntries(webpackConfig.entry);
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.output.publicPath = servers.cdn.url();

    const bundler = filterNoise(webpack(webpackConfig));

    middlewares = [
      webpackDevMiddleware(bundler, {quiet: true}),
      webpackHotMiddleware(bundler, {log: null})
    ];
  }

  return decorate({app, middlewares});
};

function addHotEntries(entries) {
  return Object.keys(entries).reduce((acc, value) => {
    acc[value] = [
      `${require.resolve('webpack-hot-middleware/client')}?dynamicPublicPath=true&path=__webpack_hmr`
    ].concat(entries[value]);
    return acc;
  }, {});
}
