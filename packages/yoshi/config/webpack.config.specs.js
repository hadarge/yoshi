const path = require('path');
const fs = require('fs');
const glob = require('glob');
const StylableWebpackPlugin = require('stylable-webpack-plugin');
const webpackConfigCommon = require('./webpack.config.common');
const mergeByConcat = require('../src/utils').mergeByConcat;
const { cssModules, tpaStyle } = require('./project');
const globs = require('../src/globs');
const projectConfig = require('./project');

const specsGlob = projectConfig.specs.browser() || globs.specs();
const karmaSetupPath = path.join(process.cwd(), 'test', `karma-setup.js`);

const entry = glob.sync(specsGlob).map(p => path.resolve(p));

if (fs.existsSync(karmaSetupPath)) {
  entry.unshift(karmaSetupPath);
}

module.exports = mergeByConcat(webpackConfigCommon, {
  entry,
  mode: 'development',
  output: {
    path: path.resolve('dist'),
    filename: 'specs.bundle.js',
  },
  module: {
    rules: [
      require('../src/loaders/sass')({
        separateCss: false,
        cssModules: cssModules(),
        tpaStyle: tpaStyle(),
      }).specs,
      require('../src/loaders/less')({
        separateCss: false,
        cssModules: cssModules(),
        tpaStyle: tpaStyle(),
      }).specs,
    ],
  },
  plugins: [
    new StylableWebpackPlugin({
      outputCSS: false,
      filename: '[name].stylable.bundle.css',
      includeCSSInJS: true,
      optimize: { classNameOptimizations: false },
    }),
  ],
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
});
