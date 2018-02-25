const union = require('lodash/union');
const webpackCommonConfig = require('./webpack.config.common');
const projectConfig = require('./project');

const stylable = require('../src/loaders/stylable');

module.exports = config => {
  const projectName = projectConfig.name();
  const cssModules = projectConfig.cssModules();

  config.resolve.extensions = union(config.resolve.extensions, webpackCommonConfig.resolve.extensions);

  config.module.rules = [
    ...webpackCommonConfig.module.rules,
    ...require('../src/loaders/sass')(false, cssModules, false, projectName).client
  ];

  config.plugins = [
    ...config.plugins || [],
    stylable.plugin()
  ];

  return config;
};
