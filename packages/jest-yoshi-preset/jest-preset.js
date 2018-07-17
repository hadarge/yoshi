const { envs } = require('./constants');

module.exports = {
  globalSetup: require.resolve('jest-environment-yoshi-puppeteer/globalSetup'),
  globalTeardown: require.resolve(
    'jest-environment-yoshi-puppeteer/globalSetup',
  ),
  transform: {
    '^.+\\.(js)$': require.resolve('babel-jest'),
  },
  projects: [
    ...[
      {
        displayName: 'component',
        testEnvironment: 'jsdom',
        testURL: 'http://localhost',
        testMatch: ['<rootDir>/src/**/*.spec.js'],
        moduleNameMapper: {
          '^.+\\.(css|scss)$': require.resolve('identity-obj-proxy'),
          '\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|eot|wav|mp3)$': require.resolve(
            './transforms/file.js',
          ),
        },
      },
      {
        displayName: 'server',
        testEnvironment: require.resolve('jest-environment-yoshi-bootstrap'),
        testMatch: ['<rootDir>/test/it/**/*.spec.js'],
      },
      {
        displayName: 'e2e',
        testEnvironment: require.resolve('jest-environment-yoshi-puppeteer'),
        testMatch: ['<rootDir>/test/e2e/**/*.e2e.js'],
      },
    ].filter(({ displayName }) => {
      if (envs) {
        return envs.includes(displayName);
      }

      return true;
    }),
    // workaround for https://github.com/facebook/jest/issues/5866
    {
      displayName: 'dummy',
      testMatch: ['dummy'],
    },
  ],
};
