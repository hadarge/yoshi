const { runIndividualTranspiler, transpileTests } = require('yoshi-config');
const { isTypescriptProject, isBabelProject } = require('../queries');

module.exports.setupRequireHooks = () => {
  if (runIndividualTranspiler) {
    if (isTypescriptProject()) {
      require('./ts-node-register');
    } else if (isBabelProject() && transpileTests) {
      require('./babel-register');
    }
  }
};
