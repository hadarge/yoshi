module.exports = function(wallaby) {
  const wallabyCommon = require('./wallaby-common')(wallaby);
  wallabyCommon.testFramework = 'jest';
  wallabyCommon.setup = () => {
    let jestConfig = require('yoshi/config/jest.config.js'); // eslint-disable-line import/no-unresolved
    if (jestConfig.preset === 'jest-yoshi-preset') {
      const jestYoshiPreset = require('jest-yoshi-preset/jest-preset'); // eslint-disable-line import/no-unresolved
      jestConfig = jestYoshiPreset.projects.find(
        project => project.displayName === 'component',
      );
    }
    wallaby.testFramework.configure(jestConfig);
  };
  return wallabyCommon;
};
