module.exports = {
  testMatch: ['**/__tests__/**/*.(spec|test).(js|ts)'],
  testResultsProcessor: 'jest-teamcity-reporter',
  testPathIgnorePatterns: [
    '/packages/create-yoshi-app/templates/',
    '/node_modules/',
    '/test/',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};
