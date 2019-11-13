const path = require('path');
const fs = require('fs');
const globby = require('globby');
const {
  createClientWebpackConfig,
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

const config = createClientWebpackConfig({
  isDebug: true,
  includeStyleLoaders: false,
});

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

  externals: {
    ...project.externals,

    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
