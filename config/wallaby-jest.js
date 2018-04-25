const path = require('path');

module.exports = function (wallaby) {
  const commonPath = path.resolve('./wallaby-common');
  const wallabyCommon = require(commonPath)(wallaby);
  wallabyCommon.testFramework = 'jest';
  wallabyCommon.setup = () => {
    wallaby.testFramework.configure(require('./package.json').jest);
    process.env.IN_WALLABY = true;
    const testSetupPath = path.resolve('./test-setup');
    require(testSetupPath);
  };
  return wallabyCommon;
};
