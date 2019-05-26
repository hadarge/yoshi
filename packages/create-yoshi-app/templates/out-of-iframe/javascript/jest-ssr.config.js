const merge = require('lodash/merge');
const { jestConfig } = require('@wix/santa-site-renderer-testkit');

module.exports = merge(jestConfig, {
  globalSetup: './__tests__/jest-setup-ssr.js',
  globals: {
    'babel-jest': {
      enableTsDiagnostics: '/__tests__/e2e-ssr/.*\\.ssr\\.js$',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['<rootDir>/__tests__/e2e-ssr/**/*.ssr.js'],
  // testResultsProcessor: 'jest-teamcity',
});
