module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/simple.test.js'],
  testEnvironment: require.resolve('../../config/startEnvironment'),
  transformIgnorePatterns: ['/node_modules/', '/test/'],
};
