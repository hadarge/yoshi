const { parastorageCdnDistUrl } = require('../../constants');

module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/simple.test.js'],
  testEnvironment: require.resolve('../../config/buildEnvironment'),
  testEnvironmentOptions: {
    parastorageCdnUrl: parastorageCdnDistUrl,
  },
  transformIgnorePatterns: ['/node_modules/', '/test/'],
};
