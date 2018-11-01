const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const path = require('path');

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

module.exports = function verifyDirectoryName(workingDir) {
  const projectName = path.basename(workingDir);
  const validationResult = validateProjectName(projectName);

  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of restrictions:`,
    );

    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
};
