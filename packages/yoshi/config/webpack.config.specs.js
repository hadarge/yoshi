const path = require('path');
const fs = require('fs');
const globby = require('globby');
const StylableWebpackPlugin = require('@stylable/webpack-plugin');
const {
  createCommonWebpackConfig,
  getStyleLoaders,
} = require('./webpack.config');
const globs = require('yoshi-config/globs');
const project = require('yoshi-config');

const specsGlob = project.specs.browser || globs.specs;
const karmaSetupPath = path.join(process.cwd(), 'test', `karma-setup.js`);

const entry = globby.sync(specsGlob).map(p => path.resolve(p));

if (fs.existsSync(karmaSetupPath)) {
  entry.unshift(karmaSetupPath);
}

const config = createCommonWebpackConfig({ isDebug: true });

const styleLoaders = getStyleLoaders({
  embedCss: false,
  isDebug: true,
  separateCss: false,
  isHmr: project.hmr,
});

module.exports = {
  ...config,

  entry,

  output: {
    ...config.output,
    path: path.resolve('dist'),
    filename: 'specs.bundle.js',
  },

  module: {
    ...config.module,

    rules: [...config.module.rules, ...styleLoaders],
  },

  plugins: [
    ...config.plugins,

    new StylableWebpackPlugin({
      outputCSS: false,
      filename: '[name].stylable.bundle.css',
      includeCSSInJS: true,
      optimize: { classNameOptimizations: false },
    }),
  ],

  externals: {
    ...project.externals,

    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
