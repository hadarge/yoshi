module.exports = {
  testMatch: ['**/__tests__/**/*.spec.js'],
  testResultsProcessor: 'jest-teamcity-reporter',
  testPathIgnorePatterns: [
    '/packages/create-yoshi-app/templates/',
    '/node_modules/',
  ],
};
