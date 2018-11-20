module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/webpack.test.js', '**/hmr.test.js'],
  testEnvironment: require.resolve('./config/startEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('./config/startGlobalSetup'),
  globalTeardown: require.resolve('./config/startGlobalTeardown'),
};
