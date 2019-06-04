module.exports = {
  testMatch: ['**/__tests__/**/*.(spec|test).js'],
  testResultsProcessor: 'jest-teamcity-reporter',
  testPathIgnorePatterns: [
    '/packages/create-yoshi-app/templates/',
    '/node_modules/',
    '/test/',
  ],
};
