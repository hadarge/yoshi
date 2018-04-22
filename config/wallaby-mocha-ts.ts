module.exports = function (wallaby) {
  process.env.NODE_PATH += `:${require('path').join(wallaby.localProjectDir, 'node_modules')}`;

  return {
    files: [
      {pattern: 'test/**/*.+(spec|it).ts*', ignore: true},
      {pattern: 'test/**/*.e2e.ts*', ignore: true},
      {pattern: 'test/**/*.ts'},
      {pattern: 'src/assets/**', instrument: false},
      {pattern: 'src/**', instrument: true},
      {pattern: 'src/**/*.+(spec|it).ts*', ignore: true},
      {pattern: 'target/**/*.json', instrument: false},
      {pattern: 'templates/**', instrument: false},
      {pattern: 'index.ts', instrument: true},
      {pattern: 'package.json', instrument: false}
    ],
    tests: [
      {pattern: 'test/**/*.+(spec|it).ts*'},
      {pattern: 'src/**/*.+(spec|it).ts*'}
    ],
    testFramework: 'mocha',
    setup(wallaby) {
      const mocha = wallaby.testFramework;
      mocha.timeout(30000);
      process.env.IN_WALLABY = true;
      require('./test-setup');

    },
    env: {
      type: 'node',
      params: {
        env: `LOCAL_PATH=${process.cwd()}`
      }
    },
    workers: {
      initial: 1,
      regular: 1
    }
  };
};
