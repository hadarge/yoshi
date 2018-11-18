module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/webpack.test.js'],
  testEnvironment: require.resolve('./buildEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./buildGlobalSetup'),
  globalTeardown: require.resolve('./buildGlobalTeardown'),
};
