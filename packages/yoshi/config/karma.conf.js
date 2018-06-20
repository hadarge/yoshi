const path = require('path');
const _ = require('lodash');
const { tryRequire, inTeamCity } = require('../src/utils');

const projectConfig = tryRequire(path.resolve('karma.conf.js')) || {
  files: [],
};

const baseConfig = {
  basePath: process.cwd(),
  browsers: projectConfig.browsers || [],
  frameworks: [],
  files: ['dist/specs.bundle.js'],
  exclude: [],
  // the user must specify the plugins
  plugins: [],
  colors: true,
};

const teamCityConfig = {
  plugins: [require('karma-teamcity-reporter')],
  reporters: ['teamcity'],
};

module.exports = config => {
  const configuration = inTeamCity()
    ? _.mergeWith(baseConfig, teamCityConfig, customizer)
    : baseConfig;
  const merged = _.mergeWith(configuration, projectConfig, customizer);
  config.set(merged);
};

function customizer(a, b) {
  let result;
  if (_.isArray(a)) {
    result = a.slice();
    result.unshift.apply(result, b);
  }
  return result;
}
