const { parastorageCdnUrl } = require('../../constants');

module.exports = {
  preset: 'jest-puppeteer',
  testMatch: [
    '**/entries.test.js',
    '**/env-vars.test.js',
    '**/externals.test.js',
    '**/loaders.test.js',
    '**/moment.test.js',
    '**/statics.test.js',
    '**/transpile-externals.test.js',
    '**/web-worker.test.js',

    // specific for build
    '**/optimize.test.js',
  ],
  testEnvironment: require.resolve('../../config/buildEnvironment'),
  testEnvironmentOptions: {
    parastorageCdnUrl,
  },
  transformIgnorePatterns: ['/node_modules/', '/test/'],
};
