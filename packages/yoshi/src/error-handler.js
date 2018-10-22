const chalk = require('chalk');

async function printAndExitOnErrors(fn) {
  try {
    return await fn();
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
}

module.exports = {
  printAndExitOnErrors,
};
