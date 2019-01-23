module.exports = {
  preset: 'jest-puppeteer',
  testMatch: [
    '**/dev-server.test.js',
    '**/entries.test.js',
    '**/env-vars.test.js',
    '**/externals.test.js',
    '**/hmr.test.js',
    '**/loaders.test.js',
    '**/moment.test.js',
    '**/statics.test.js',
    '**/transpile-externals.test.js',
  ],
  testEnvironment: require.resolve('../../config/startEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
  globalSetup: require.resolve('../../config/startGlobalSetup'),
  globalTeardown: require.resolve('../../config/startGlobalTeardown'),
};
