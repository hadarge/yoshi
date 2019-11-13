const merge = require('lodash/merge');
const projectConfig = require('yoshi-config');
const { inTeamCity } = require('yoshi-helpers/queries');

const jestProjectConfig = projectConfig.jestConfig;

const config = merge(
  {
    transform: {
      '\\.jsx?$': require.resolve('./jest-transformer'),
      '\\.st.css?$': require.resolve('@stylable/jest'),
      '\\.svg$': require.resolve('./svg-transformer.js'),
    },
  },
  jestProjectConfig,
);

config.transformIgnorePatterns = (config.transformIgnorePatterns || []).concat([
  '/node_modules/(?!(.*?\\.(st\\.css|svg)$))',
]);

if (inTeamCity()) {
  config.testResultsProcessor = require.resolve('jest-teamcity-reporter');
}

module.exports = config;
