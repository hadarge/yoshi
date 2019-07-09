const { spawnSync } = require('child_process');
const { isAbsolute } = require('path');
const homeDir = require('os').homedir();

// cache result in env var since wallaby runs this file multiple times in the same process
if (!process.env.WALLABY_NODE_PATH && process.platform !== 'win32') {
  process.env.WALLABY_NODE_PATH = 'N/A';
  let nvmOutput = spawnSync(
    '/bin/sh',
    ['-c', `. ${homeDir}/.nvm/nvm.sh && nvm which`],
    {
      encoding: 'utf-8',
    },
  );
  if (
    nvmOutput.status === 1 &&
    nvmOutput.stderr.includes('is not yet installed')
  ) {
    // if .nvmrc's version is not installed, get default version
    nvmOutput = spawnSync(
      '/bin/sh',
      ['-c', `. ${homeDir}/.nvm/nvm.sh && nvm which default`],
      {
        encoding: 'utf-8',
      },
    );
  }
  if (nvmOutput.status === 0) {
    const stdout = nvmOutput.stdout.split('\n');
    process.env.WALLABY_NODE_PATH =
      (isAbsolute(stdout[0]) && stdout[0]) ||
      (isAbsolute(stdout[1]) && stdout[1]);
  }
}

module.exports = function(wallaby) {
  process.env.NODE_PATH += `:${require('path').join(
    wallaby.localProjectDir,
    'node_modules',
  )}`;
  return {
    files: [
      { pattern: 'src/templates/**', instrument: false },
      { pattern: 'test/**/*.+(spec|it).[j|t]s', ignore: true },
      { pattern: 'test/**/*.+(spec|it).[j|t]sx', ignore: true },
      { pattern: 'test/**/*.e2e.[j|t]s', ignore: true },
      { pattern: '__tests__/**/*.+(spec|it).[j|t]s', ignore: true },
      { pattern: '__tests__/**/*.+(spec|it).[j|t]sx', ignore: true },
      { pattern: '__tests__/**/*.e2e.[j|t]s', ignore: true },
      { pattern: 'src/**/*.+(spec|it).[j|t]s', ignore: true },
      { pattern: 'src/**/*.+(spec|it).[j|t]sx', ignore: true },
      { pattern: 'src/assets/**', instrument: false },
      { pattern: 'src/**', instrument: true },
      { pattern: 'target/**/*.json', instrument: false },
      { pattern: 'templates/**', instrument: false },
      { pattern: 'index.js', instrument: true },
      { pattern: 'package.json', instrument: false },
      { pattern: 'tsconfig.json', instrument: false },
      { pattern: 'pom.xml', instrument: false },
      'testkit/**/*.[j|t]s',
      'test/**/*.[j|t]s',
      'test/**/*.[j|t]sx',
      'test/**/*.json',
      '__tests__/**/*.[j|t]s',
      '__tests__/**/*.[j|t]sx',
      '__tests__/**/*.json',
      'src/**/*.scss',
    ],
    tests: [
      { pattern: 'src/**/*.+(spec|it).[j|t]s' },
      { pattern: 'src/**/*.+(spec|it).[j|t]sx' },
    ],
    env: {
      type: 'node',
      runner:
        process.env.WALLABY_NODE_PATH === 'N/A'
          ? null
          : process.env.WALLABY_NODE_PATH, // if falsy, defaults to Wallaby's node or System's node
      params: {
        env: `SRC_PATH=./src;NODE_ENV=test;WIX_NODE_BUILD_WATCH_MODE=true;`,
      },
    },
    workers: {
      initial: 1,
      regular: 1,
      recycle: true,
    },
  };
};
