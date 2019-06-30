const chalk = require('chalk');
const { isPrivateRegistryReachable } = require('../src/utils');

module.exports = function verifyRegistry(workingDir) {
  if (!isPrivateRegistryReachable(workingDir)) {
    console.error(
      chalk.red(
        `Wix Private Registry is not reachable, please connect to VPN and try again`,
      ),
    );
    process.exit(1);
  }
};
