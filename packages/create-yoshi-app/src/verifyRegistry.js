const chalk = require('chalk');
const { getRegistry } = require('../src/utils');
const { privateRegistry } = require('../src/constants');

module.exports = function verifyRegistry(workingDir) {
  const registry = getRegistry(workingDir);

  if (!registry.includes(privateRegistry)) {
    console.log(`You should be authenticated to Wix's private registry`);
    console.log('Run the following command and try again:\n');
    console.log(chalk.cyan(`  npm config set registry ${privateRegistry}`));

    process.exit(1);
  }
};
