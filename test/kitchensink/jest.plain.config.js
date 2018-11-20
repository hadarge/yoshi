module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/output.test.js'],
  testEnvironment: require.resolve('./config/plainEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./config/plainGlobalSetup'),
  globalTeardown: require.resolve('./config/plainGlobalTeardown'),
};
