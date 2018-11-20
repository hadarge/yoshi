module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/webpack.test.js'],
  testEnvironment: require.resolve('./config/buildEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./config/buildGlobalSetup'),
  globalTeardown: require.resolve('./config/buildGlobalTeardown'),
};
