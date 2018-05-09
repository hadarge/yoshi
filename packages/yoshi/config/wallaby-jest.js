module.exports = function(wallaby) {
  const wallabyCommon = require('./wallaby-common')(wallaby);
  wallabyCommon.testFramework = 'jest';
  wallabyCommon.setup = () => {
    const jestConfig = require('yoshi/config/jest.config.js'); // eslint-disable-line import/no-unresolved
    wallaby.testFramework.configure(jestConfig);
    process.env.IN_WALLABY = true;
  };
  return wallabyCommon;
};
