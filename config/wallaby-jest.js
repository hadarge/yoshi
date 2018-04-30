module.exports = function (wallaby) {
  const wallabyCommon = require('./wallaby-common')(wallaby);
  wallabyCommon.testFramework = 'jest';
  wallabyCommon.setup = () => {
    wallaby.testFramework.configure(require('./package.json').jest);
    process.env.IN_WALLABY = true;
    require('yoshi/config/test-setup');
  };
  return wallabyCommon;
};
