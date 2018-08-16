const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { isObject } = require('lodash');
const { staticsDomain } = require('../src/constants');
const StylableWebpackPlugin = require('stylable-webpack-plugin');
const DynamicPublicPath = require('../src/webpack-plugins/dynamic-public-path');
const {
  mergeByConcat,
  isSingleEntry,
  inTeamCity,
  isProduction,
} = require('../src/utils');
const projectConfig = require('./project');
const webpackConfigCommon = require('./webpack.config.common');

const defaultSplitChunksConfig = {
  chunks: 'all',
  name: 'commons',
  minChunks: 2,
};

function getPublicPath() {
  const artifactName = process.env.ARTIFACT_ID;
  const artifactVersion = process.env.ARTIFACT_VERSION;

  if (artifactName && artifactVersion) {
    // Projects that uses `wnpm-ci` have their package.json version field on a fixed version which is not their real version
    // These projects determine their version on the "release" step, which means they will have a wrong public path
    // We currently can't support static public path of packages that deploy to unpkg

    // if (projectConfig.unpkg()) {
    //   return `${unpkgDomain}/${projectConfig.name()}@${projectConfig.version()}/dist/statics/`;
    // }

    return `${staticsDomain}/${artifactName}/${artifactVersion.replace(
      '-SNAPSHOT',
      '',
    )}/`;
  }

  return '/';
}

const publicPath = getPublicPath();

const config = ({
  min,
  separateCss = projectConfig.separateCss(),
  hmr,
  analyze,
} = {}) => {
  const disableModuleConcat =
    process.env.DISABLE_MODULE_CONCATENATION === 'true';
  const projectName = projectConfig.name();
  const cssModules = projectConfig.cssModules();
  const tpaStyle = projectConfig.tpaStyle();
  const useSplitChunks = projectConfig.splitChunks();
  const splitChunksConfig = isObject(useSplitChunks)
    ? useSplitChunks
    : defaultSplitChunksConfig;

  if (separateCss === 'prod') {
    if (inTeamCity() || isProduction()) {
      separateCss = true;
    } else {
      separateCss = false;
    }
  }

  const stylableSeparateCss = false; // this is a temporary fix until stylable will be concatenated into a single css bundle of the app

  return mergeByConcat(webpackConfigCommon, {
    entry: getEntry(),

    mode: isProduction() ? 'production' : 'development',

    optimization: {
      minimize: min,
      splitChunks: useSplitChunks ? splitChunksConfig : false,
      concatenateModules: isProduction() && !disableModuleConcat,
      minimizer: [
        new UglifyJsPlugin({
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: true,
          uglifyOptions: {
            output: {
              // support emojis
              ascii_only: true,
            },
            keep_fnames: projectConfig.keepFunctionNames(),
          },
        }),
      ],
    },

    module: {
      rules: [
        ...require('../src/loaders/sass')({
          separateCss,
          cssModules,
          tpaStyle,
          projectName,
          hmr,
          min,
        }).client,
        ...require('../src/loaders/less')({
          separateCss,
          cssModules,
          tpaStyle,
          projectName,
          hmr,
          min,
        }).client,
      ],
    },

    plugins: [
      ...(analyze ? [new BundleAnalyzerPlugin()] : []),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new webpack.LoaderOptionsPlugin({
        minimize: min,
      }),

      new DuplicatePackageCheckerPlugin({ verbose: true }),

      new DynamicPublicPath(),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': isProduction()
          ? '"production"'
          : '"development"',
        'window.__CI_APP_VERSION__': process.env.ARTIFACT_VERSION
          ? `"${process.env.ARTIFACT_VERSION}"`
          : '"0.0.0"',
      }),

      new StylableWebpackPlugin({
        outputCSS: stylableSeparateCss,
        filename: '[name].stylable.bundle.css',
        includeCSSInJS: !stylableSeparateCss,
        optimize: { classNameOptimizations: false, shortNamespaces: false },
      }),

      ...(!separateCss
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: min ? '[name].min.css' : '[name].css',
            }),
            new RtlCssPlugin(min ? '[name].rtl.min.css' : '[name].rtl.css'),
          ]),
    ],

    devtool: inTeamCity() ? 'source-map' : 'cheap-module-source-map',

    performance: {
      ...(isProduction() ? projectConfig.performanceBudget() : {}),
    },

    output: {
      umdNamedDefine: projectConfig.umdNamedDefine(),
      path: path.resolve('./dist/statics'),
      filename: min ? '[name].bundle.min.js' : '[name].bundle.js',
      chunkFilename: min ? '[name].chunk.min.js' : '[name].chunk.js',
      pathinfo: !min,
      publicPath,
    },

    target: 'web',
  });
};

function getEntry() {
  const entry = projectConfig.entry() || projectConfig.defaultEntry();
  return isSingleEntry(entry) ? { app: entry } : entry;
}

module.exports = config;
