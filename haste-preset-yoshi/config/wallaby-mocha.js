module.exports = function (wallaby) {
  const wallabyCommon = require('./wallaby-common')(wallaby);
  wallabyCommon.testFramework = 'mocha';
  wallabyCommon.setup = () => {
    require('babel-polyfill');
    const mocha = wallaby.testFramework;
    mocha.timeout(30000);
    process.env.IN_WALLABY = true;
    require('haste-preset-yoshi/config/test-setup');
  };
  return wallabyCommon;
};
