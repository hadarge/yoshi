const chalk = require('chalk');
const {
  clearConsole,
  npmInstall,
  lintFix,
  gitInit,
  isInsideGitRepo,
} = require('./utils');
const runPrompt = require('./runPrompt');
const generateProject = require('./generateProject');

module.exports = async ({
  workingDir,
  templateModel,
  install = true,
  lint = true,
}) => {
  clearConsole();

  if (!templateModel) {
    // Use ' ' due to a technical problem in hyper when you don't see the first char after clearing the console
    console.log(
      ' ' + chalk.underline('Please answer the following questions:\n'),
    );

    // If we don't have template model injected, ask the user
    // to answer the questions and generate one for us
    templateModel = await runPrompt(workingDir);
  }

  console.log(
    `\nCreating a ${chalk.cyan(
      templateModel.getTitle(),
    )} project in:\n\n${chalk.green(workingDir)}\n`,
  );

  generateProject(templateModel, workingDir);

  if (!isInsideGitRepo(workingDir)) {
    gitInit(workingDir);
  }

  if (install) {
    npmInstall(workingDir);
  }

  if (lint) {
    lintFix(workingDir);
  }

  return templateModel;
};
