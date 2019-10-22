import path from 'path';
import chalk from 'chalk';
import validateProjectName from 'validate-npm-package-name';

function printValidationResults(results?: Array<string>) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

export default function verifyDirectoryName(workingDir: string) {
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
}
