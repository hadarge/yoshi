const merge = require('lodash/merge');
const { jestConfig } = require('@wix/santa-site-renderer-testkit');

module.exports = merge(jestConfig, {
  globalSetup: './test/jest-setup-ssr.js',
  globals: {
    'babel-jest': {
      enableTsDiagnostics: '/test/e2e-ssr/.*\\.e2e\\.js$',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['<rootDir>/test/e2e-ssr/**/*.spec.js'],
  // testResultsProcessor: 'jest-teamcity',
});
