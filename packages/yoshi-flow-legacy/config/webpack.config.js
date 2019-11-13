const { isObject } = require('lodash');
const {
  createBaseWebpackConfig,
  getStyleLoaders: getCommonStyleLoaders,
} = require('yoshi-common/webpack.config');
const { validateServerEntry } = require('yoshi-common/webpack-utils');
const projectConfig = require('yoshi-config');
const {
  isSingleEntry,
  isProduction: checkIsProduction,
  inTeamCity: checkInTeamCity,
  isTypescriptProject: checkIsTypescriptProject,
} = require('yoshi-helpers/queries');
const { defaultEntry } = require('yoshi-helpers/constants');

const isProduction = checkIsProduction();
const inTeamCity = checkInTeamCity();
const isTypescriptProject = checkIsTypescriptProject();

const computedSeparateCss =
  projectConfig.separateCss === 'prod'
    ? inTeamCity || isProduction
    : projectConfig.separateCss;

const stylableSeparateCss = projectConfig.enhancedTpaStyle;

const defaultSplitChunksConfig = {
  chunks: 'all',
  name: 'commons',
  minChunks: 2,
};

const useSplitChunks = projectConfig.splitChunks;

const splitChunksConfig = isObject(useSplitChunks)
  ? useSplitChunks
  : defaultSplitChunksConfig;

const defaultOptions = {
  name: projectConfig.name,
  useTypeScript: isTypescriptProject,
  useAngular: projectConfig.isAngularProject,
  separateCss: computedSeparateCss,
  keepFunctionNames: projectConfig.keepFunctionNames,
  stylableSeparateCss,
  experimentalRtlCss: projectConfig.experimentalRtlCss,
  cssModules: projectConfig.cssModules,
  devServerUrl: projectConfig.servers.cdn.url,
  externalizeRelativeLodash: projectConfig.externalizeRelativeLodash,
  performanceBudget: projectConfig.performanceBudget,
  enhancedTpaStyle: projectConfig.enhancedTpaStyle,
  tpaStyle: projectConfig.tpaStyle,
};

function getStyleLoaders({ embedCss, isHmr, tpaStyle } = {}) {
  const styleLoaders = getCommonStyleLoaders({
    ...defaultOptions,
    isDev: true,
    isHot: isHmr,
    separateCss: false,
    tpaStyle,
    embedCss,
  });

  return styleLoaders;
}

function createClientWebpackConfig({
  isAnalyze = false,
  isDebug = true,
  isHmr,
  withLocalSourceMaps,
  includeStyleLoaders = true,
} = {}) {
  const webpackConfig = createBaseWebpackConfig({
    target: 'web',
    isDev: isDebug,
    isHot: isHmr,
    isAnalyze,
    includeStyleLoaders,
    ...defaultOptions,
  });

  const entry = projectConfig.entry || defaultEntry;

  webpackConfig.entry = isSingleEntry(entry) ? { app: entry } : entry;
  webpackConfig.output.umdNamedDefine = projectConfig.umdNamedDefine;
  webpackConfig.externals = projectConfig.externals;

  webpackConfig.resolve.alias = projectConfig.resolveAlias;

  if (useSplitChunks) {
    webpackConfig.optimization.splitChunks = splitChunksConfig;
  }

  if (projectConfig.exports) {
    webpackConfig.output = {
      ...webpackConfig.output,

      library: projectConfig.exports,
      libraryTarget: 'umd',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    };
  }

  if (withLocalSourceMaps) {
    webpackConfig.devtool = 'source-map';
  }

  return webpackConfig;
}

function createServerWebpackConfig({
  isDebug = true,
  isHmr = false,
  // hmrPort,
} = {}) {
  const webpackConfig = createBaseWebpackConfig({
    target: 'node',
    isDev: isDebug,
    isHot: isHmr,
    ...defaultOptions,
  });

  webpackConfig.entry = async () => {
    const serverEntry = validateServerEntry({
      extensions: webpackConfig.resolve.extensions,
    });

    let entryConfig = {};

    if (serverEntry) {
      entryConfig = { ...entryConfig, server: serverEntry };
    }

    return entryConfig;
  };

  return webpackConfig;
}

module.exports = {
  getStyleLoaders,
  createClientWebpackConfig,
  createServerWebpackConfig,
};
