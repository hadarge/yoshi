const fs = require('fs');
const globby = require('globby');
const { envs } = require('./constants');
const globs = require('yoshi-config/globs');

const modulePathIgnorePatterns = ['<rootDir>/dist/', '<rootDir>/target/'];
module.exports = {
  globalSetup: require.resolve('jest-environment-yoshi-puppeteer/globalSetup'),
  globalTeardown: require.resolve(
    'jest-environment-yoshi-puppeteer/globalTeardown',
  ),
  projects: [
    ...[
      {
        displayName: 'spec',
        testEnvironment: 'jsdom',
        testURL: 'http://localhost',
        testMatch: [`<rootDir>/${globs.unitTests}`],
      },
      {
        displayName: 'e2e',
        testEnvironment: require.resolve('jest-environment-yoshi-puppeteer'),
        testMatch: [`<rootDir>/${globs.e2eTests}`],
        setupFiles: [
          require.resolve(
            'jest-environment-yoshi-bootstrap/environment-setup.js',
          ),
        ],
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
          `__tests__/${project.displayName}-setup.(ts|js){,x}`,
        );

        const setupTestsFile =
          setupTestsPath && fs.existsSync(setupTestsPath)
            ? `<rootDir>/${setupTestsPath}`
            : undefined;

        // Since Jest 24 setupTestFrameworkScriptFile changed to setupFilesAfterEnv and
        // now it supports more than 1 test file, in future we can expose it here
        const setupFilesAfterEnv = setupTestsFile ? [setupTestsFile] : [];

        return {
          ...project,

          modulePathIgnorePatterns,

          transformIgnorePatterns: [
            '/node_modules/(?!(.*?\\.st\\.css$))',
            // Locally `babel-preset-yoshi` is symlinked, which causes jest to try and run babel on it.
            // See here for more details: https://github.com/facebook/jest/blob/6af2f677e5c48f71f526d4be82d29079c1cdb658/packages/jest-core/src/runGlobalHook.js#L61
            '/babel-preset-yoshi/',
          ],

          transform: {
            '^.+\\.jsx?$': require.resolve('./transforms/babel'),
            '^.+\\.tsx?$': require.resolve('ts-jest'),
            '\\.st.css?$': require.resolve('@stylable/jest'),
            '\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|eot|wav|mp3)$': require.resolve(
              './transforms/file',
            ),
          },

          moduleNameMapper: {
            '^(?!.+\\.st\\.css$)^.+\\.(?:sass|s?css)$': require.resolve(
              'identity-obj-proxy',
            ),
          },

          setupFilesAfterEnv,

          moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
        };
      }),
    // workaround for https://github.com/facebook/jest/issues/5866
    {
      displayName: 'dummy',
      testMatch: ['dummy'],
      modulePathIgnorePatterns,
    },
  ],
};
