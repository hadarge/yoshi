const glob = require('glob');
const path = require('path');
const webpackConfigCommon = require('./webpack.config.common');
const mergeByConcat = require('../src/utils').mergeByConcat;
const { cssModules, tpaStyle } = require('./project');
const globs = require('../src/globs');
const projectConfig = require('./project');

const specsGlob = projectConfig.specs.browser() || globs.specs();

module.exports = mergeByConcat(webpackConfigCommon, {
  entry: glob.sync(specsGlob).map(p => path.resolve(p)),
  mode: 'development',
  output: {
    path: path.resolve('dist'),
    filename: 'specs.bundle.js',
  },
  module: {
    rules: [
      require('../src/loaders/sass')(false, cssModules(), tpaStyle()).specs,
      require('../src/loaders/less')(false, cssModules(), tpaStyle()).specs,
    ],
  },
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
});
