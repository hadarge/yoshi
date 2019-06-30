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

    // specific for start
    '**/hmr.test.js',
    '**/dev-server.test.js',
  ],
  testEnvironment: require.resolve('../../config/startEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
};
