module.exports = function(wallaby) {
  const wallabyCommon = require('./wallaby-common')(wallaby);

  wallabyCommon.tests.unshift(
    { pattern: 'test/**/*.+(spec|it).[j|t]s' },
    { pattern: 'test/**/*.+(spec|it).[j|t]sx' },
  );

  wallabyCommon.compilers = {
    '**/*.js{,x}': wallaby.compilers.babel({
      babel: require('@babel/core'),
      babelrc: false,
      plugins: [require.resolve('babel-preset-yoshi')],
    }),
  };

  wallabyCommon.testFramework = 'mocha';

  wallabyCommon.setup = () => {
    const mocha = wallaby.testFramework;
    mocha.timeout(30000);
    process.env.IN_WALLABY = true;
    require('yoshi/config/test-setup'); // eslint-disable-line import/no-unresolved
  };

  return wallabyCommon;
};
