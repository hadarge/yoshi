const path = require('path');

module.exports = function (wallaby) {
  const commonPath = path.resolve('./wallaby-common');
  const wallabyCommon = require(commonPath)(wallaby);
  wallabyCommon.testFramework = 'mocha';
  wallabyCommon.setup = () => {
    require('babel-polyfill');
    const mocha = wallaby.testFramework;
    mocha.timeout(30000);
    process.env.IN_WALLABY = true;
    const testSetupPath = path.resolve('./test-setup');
    require(testSetupPath);
  };
  return wallabyCommon;
};
