const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const context = path.resolve('./src');
const projectConfig = require('./project');

const config = {
  context,

  output: getOutput(),

  resolve: {
    modules: ['node_modules', context],

    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    symlinks: false,
  },

  resolveLoader: {
    modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules'],
  },

  plugins: [
    { apply: () => (process.env.IN_WEBPACK = 'true') },
    new CaseSensitivePathsPlugin(),
  ],

  module: {
    rules: [
      ...(projectConfig.features().externalizeRelativeLodash
        ? [require('../src/loaders/externalize-relative-lodash')()]
        : []),
      ...(projectConfig.isAngularProject()
        ? [require('../src/loaders/ng-annotate')()]
        : []),
      require('../src/loaders/babel')(),
      require('../src/loaders/typescript')(projectConfig.isAngularProject()),
      require('../src/loaders/graphql')(),
      require('../src/loaders/assets')(),
      require('../src/loaders/svg')(),
      require('../src/loaders/html')(),
      require('../src/loaders/haml')(),
      require('../src/loaders/raw')(),
    ],
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    __dirname: true,
  },

  devtool: 'source-map',

  externals: projectConfig.externals(),
};

function getOutput() {
  const libraryExports = projectConfig.exports();
  const output = {
    path: path.resolve('./dist'),
    pathinfo: true,
  };

  if (libraryExports) {
    return Object.assign({}, output, {
      library: libraryExports,
      libraryTarget: 'umd',
      globalObject: "typeof self !== 'undefined' ? self : this",
    });
  }

  return output;
}

module.exports = config;
