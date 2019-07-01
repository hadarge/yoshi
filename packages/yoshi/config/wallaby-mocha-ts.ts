const path = require('path');

module.exports = function(wallaby: any) {
  process.env.NODE_PATH += `:${path.join(
    wallaby.localProjectDir,
    'node_modules',
  )}`;

  return {
    files: [
      { pattern: 'test/**/*.+(spec|it).ts*', ignore: true },
      { pattern: 'test/**/*.e2e.ts*', ignore: true },
      { pattern: 'test/**/*.ts' },
      { pattern: 'src/assets/**', instrument: false },
      { pattern: 'src/**', instrument: true },
      { pattern: 'src/**/*.+(spec|it).ts*', ignore: true },
      { pattern: 'target/**/*.json', instrument: false },
      { pattern: 'templates/**', instrument: false },
      { pattern: 'index.ts', instrument: true },
      { pattern: 'package.json', instrument: false },
    ],
    tests: [
      { pattern: 'test/**/*.+(spec|it).ts*' },
      { pattern: 'src/**/*.+(spec|it).ts*' },
    ],
    testFramework: 'mocha',
    setup(config: any) {
      const mocha = config.testFramework;
      mocha.timeout(30000);
      process.env.IN_WALLABY = 'true';
      // eslint-disable-next-line
      require('yoshi/config/test-setup');
    },
    env: {
      type: 'node',
      params: {
        env: `LOCAL_PATH=${process.cwd()}`,
      },
    },
    workers: {
      initial: 1,
      regular: 1,
    },
  };
};
