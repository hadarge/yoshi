const { transpileTests } = require('yoshi-config');
const { isTypescriptProject } = require('../queries');

module.exports.setupRequireHooks = () => {
  if (isTypescriptProject()) {
    require('./ts-node-register');
  } else if (transpileTests) {
    require('./babel-register');
  }
};
