const fs = require('fs');
const globby = require('globby');
const { envs } = require('./constants');

module.exports = {
  globalSetup: require.resolve('jest-environment-yoshi-puppeteer/globalSetup'),
  globalTeardown: require.resolve(
    'jest-environment-yoshi-puppeteer/globalTeardown',
  ),
  projects: [
    ...[
      {
        displayName: 'component',
        testEnvironment: 'jsdom',
        testURL: 'http://localhost',
        testMatch: ['<rootDir>/src/**/*.spec.(ts|js){,x}'],
      },
      {
        displayName: 'server',
        testEnvironment: require.resolve('jest-environment-yoshi-bootstrap'),
        testMatch: ['<rootDir>/test/server/**/*.spec.(ts|js){,x}'],
      },
      {
        displayName: 'e2e',
        testEnvironment: require.resolve('jest-environment-yoshi-puppeteer'),
        testMatch: ['<rootDir>/test/e2e/**/*.spec.(ts|js){,x}'],
      },
    ]
      .filter(({ displayName }) => {
        if (envs) {
          return envs.includes(displayName);
        }

        return true;
      })
      .map(project => {
        const [setupTestsPath] = globby.sync(
          `test/setup.${project.displayName}.(ts|js){,x}`,
        );

        const setupTestsFile =
          setupTestsPath && fs.existsSync(setupTestsPath)
            ? `<rootDir>/${setupTestsPath}`
            : undefined;

        return {
          ...project,

          transformIgnorePatterns: ['/node_modules/(?!(.*?\\.st\\.css$))'],

          transform: {
            '^.+\\.jsx?$': require.resolve('babel-jest'),
            '^.+\\.tsx?$': require.resolve('ts-jest'),
            '\\.st.css?$': require.resolve('./transforms/stylable'),
          },

          moduleNameMapper: {
            '^.+\\.(sass|scss)$': require.resolve('identity-obj-proxy'),
            '\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|eot|wav|mp3)$': require.resolve(
              './transforms/file',
            ),
          },

          setupTestFrameworkScriptFile: setupTestsFile,

          moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
        };
      }),
    // workaround for https://github.com/facebook/jest/issues/5866
    {
      displayName: 'dummy',
      testMatch: ['dummy'],
    },
  ],
};
