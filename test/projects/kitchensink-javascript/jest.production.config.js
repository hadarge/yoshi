module.exports = {
  preset: 'jest-puppeteer',
  testMatch: [
    '**/entries.test.js',
    '**/env-vars.test.js',
    '**/externals.test.js',
    '**/loaders.test.js',
    '**/moment.test.js',
    '**/optimize.test.js',
    '**/statics.test.js',
    '**/transpile-externals.test.js',
  ],
  testEnvironment: require.resolve('../../config/buildEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
};
