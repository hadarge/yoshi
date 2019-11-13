const envinfo = require('envinfo');

let envinfoCache = undefined;

async function getEnvInfo() {
  if (!envinfoCache) {
    envinfoCache = envinfo.run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
        Browsers: ['Chrome', 'Firefox', 'Safari'],
        npmPackages: [
          'yoshi-config',
          'yoshi-helpers',
          'yoshi-runtime',
          'babel-preset-yoshi',
          'eslint-config-yoshi',
          'eslint-config-yoshi-base',
          'jest-yoshi-preset',
          'tslint-config-yoshi',
          'tslint-config-yoshi-base',
          'webpack',
          'storybook',
          'typescript',
          '@storybook/core',
          '@storybook/react',
        ],
      },
      { showNotFound: true, fullTree: true },
    );
  }

  return await envinfoCache;
}

module.exports = {
  getEnvInfo,
};
