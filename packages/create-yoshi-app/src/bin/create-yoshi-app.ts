import path from 'path';
import program from 'commander';
import chalk from 'chalk';
import { ensureDirSync } from 'fs-extra';
import createApp from '../createApp';
import TemplateModel from '../TemplateModel';
import verifyDirectoryName from '../verifyDirectoryName';
import verifyWorkingDirectory from '../verifyWorkingDirectory';
import verifyRegistry from '../verifyRegistry';
import verifyMinimumNodeVersion from '../verifyMinimumNodeVersion';
import { minimumNodeVersion } from '../constants';

const pkg = require('../../package.json');

process.on('unhandledRejection', error => {
  throw error;
});

program
  .version(pkg.version)
  .option(
    '--answers-file [filepath]',
    'A path to a javascript file that returns an answers object',
  )
  .arguments('[project-directory]')
  .usage(chalk.cyan('[project-directory]'))
  .parse(process.argv);

let workingDir = process.cwd();
const customProjectDir = program.args[0];
const answersFile = program.answersFile;

verifyDirectoryName(customProjectDir || workingDir);

if (customProjectDir) {
  ensureDirSync(customProjectDir);
  workingDir = path.resolve(customProjectDir);
  process.chdir(workingDir);
}

verifyWorkingDirectory(workingDir);
verifyRegistry(workingDir);
verifyMinimumNodeVersion(minimumNodeVersion);

const templateModel = answersFile
  ? TemplateModel.fromFilePath(answersFile)
  : undefined;

createApp({
  workingDir,
  templateModel,
}).then(({ projectName }) => {
  console.log(
    `\nSuccess! 🙌  Created ${chalk.magenta(projectName)} at ${chalk.green(
      workingDir,
    )}`,
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
      customProjectDir ? 's' : ''
    }:\n`,
  );

  if (customProjectDir) {
    console.log(chalk.cyan(`cd ${customProjectDir}`));
  }

  console.log(chalk.cyan('npm start\n'));

  console.log('For more information visit https://github.com/wix/yoshi');
  console.log('Good luck! 🍀');
});
