module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/output.test.js'],
  testEnvironment: require.resolve('./plainEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./plainGlobalSetup'),
  globalTeardown: require.resolve('./plainGlobalTeardown'),
};
