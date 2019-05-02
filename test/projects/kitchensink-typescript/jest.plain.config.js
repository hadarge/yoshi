module.exports = {
  preset: 'jest-puppeteer',
  testMatch: [
    '**/analyze.test.js',
    '**/manifest.test.js',
    '**/output.test.js',
    '**/stats.test.js',
  ],
  testEnvironment: require.resolve('../../config/plainEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('../../config/plainGlobalSetup'),
  globalTeardown: require.resolve('../../config/plainGlobalTeardown'),
};
