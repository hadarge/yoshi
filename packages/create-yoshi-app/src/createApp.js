const chalk = require('chalk');
const {
  clearConsole,
  install,
  lintFix,
  gitInit,
  isInsideGitRepo,
} = require('./utils');
const verifyWorkingDirectory = require('./verifyWorkingDirectory');
const runPrompt = require('./runPrompt');
const generateProject = require('./generateProject');
const verifyRegistry = require('./verifyRegistry');
const verifyMinimumNodeVersion = require('yoshi-helpers/verifyMinimumNodeVersion');
const { minimumNodeVersion } = require('./constants');
const fs = require('fs-extra');
const TemplateModel = require('./TemplateModel');

module.exports = async ({ workingDir, projectDirName, answersFile }) => {
  verifyWorkingDirectory(workingDir);
  verifyRegistry(workingDir);
  verifyMinimumNodeVersion(minimumNodeVersion);

  clearConsole();

  // Use ' ' due to a technical problem in hyper when you don't see the first char after clearing the console
  console.log(
    ' ' + chalk.underline('Please answer the following questions:\n'),
  );

  const results = answersFile
    ? readAnswersFile(answersFile)
    : await runPrompt(workingDir);

  console.log(
    `\nCreating a new ${chalk.cyan(
      results.getTitle(),
    )} project in ${chalk.green(workingDir)}\n`,
  );

  generateProject(results, workingDir);

  if (!isInsideGitRepo(workingDir)) {
    gitInit(workingDir);
  }

  install(workingDir);

  lintFix(workingDir);

  console.log(
    `\nSuccess! 🙌  Created ${chalk.magenta(
      results.projectName,
    )} at ${chalk.green(workingDir)}`,
  );

  console.log('You can run the following commands:\n');
  console.log(chalk.cyan('  npm start'));
  console.log('    Start your app in development mode\n');
  console.log(chalk.cyan('  npm test'));
  console.log('    Run the test runner\n');
  console.log(chalk.cyan('  npx yoshi lint'));
  console.log('    Run the linter\n');
  console.log(chalk.cyan('  npx yoshi build'));
  console.log('    Build your app for production\n');

  console.log(
    `We advise you'll start by running the following command${
      projectDirName ? 's' : ''
    }:\n`,
  );

  if (projectDirName) {
    console.log(chalk.cyan(`cd ${projectDirName}`));
  }

  console.log(chalk.cyan('npm start\n'));

  console.log('For more information visit https://github.com/wix/yoshi');
  console.log('Good luck! 🍀');
};

function readAnswersFile(answersFilePath) {
  return TemplateModel.fromJSON(fs.readJSONSync(answersFilePath));
}
