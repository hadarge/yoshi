#! /usr/bin/env node

process.on('unhandledRejection', error => {
  throw error;
});

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const execa = require('execa');
const { runPrompts, generateProject } = require('../src/index');
const pkg = require('../package.json');

const privateRegistry = 'http://npm.dev.wixpress.com';

const clearConsole = () => process.stdout.write('\x1Bc');

program
  .version(pkg.version)
  .arguments('[project-directory]')
  .usage(chalk.cyan('[project-directory]'))
  .parse(process.argv);

const customProjectDir = program.args[0];

if (customProjectDir) {
  fs.ensureDirSync(customProjectDir);
  process.chdir(path.resolve(customProjectDir));
}

createApp(process.cwd());

function install(dir) {
  console.log(
    `Running ${chalk.magenta(
      'npm install',
    )}, that might take a few minutes... ⌛ \n`,
  );

  execa.shellSync('npm install', {
    cwd: dir,
    stdio: 'inherit',
  });
}

function getRegistry(dir) {
  // TODO: change to npm ping to the private registry when it will be fixed with the CI team
  const { stdout } = execa.shellSync('npm config get registry', {
    cwd: dir,
    stdio: 'pipe',
  });

  return stdout;
}

function lintFix(dir) {
  console.log(`\nRunning ${chalk.magenta('yoshi lint --fix')}\n`);
  execa.shellSync('npx yoshi lint --fix', {
    cwd: dir,
    stdio: 'inherit',
  });
}

async function createApp(workingDir) {
  const emptyDirectory = fs.readdirSync(workingDir).length === 0;

  if (!emptyDirectory) {
    console.log(`The directory "${workingDir}" is not an empty directory\n`);
    console.log('Aborting...');

    process.exit(1);
  }

  const registry = getRegistry(workingDir);

  if (!registry.includes(privateRegistry)) {
    console.log(`You should be authenticated to Wix's private registry`);
    console.log('Run the following command and try again:\n');
    console.log(chalk.cyan(`  npm config set registry ${privateRegistry}`));

    return;
  }

  clearConsole();

  console.log(chalk.underline('Please answer the following questions:\n'));

  let promptAborted = false;
  // use customProjectDir to ask less questions
  const results = await runPrompts(workingDir, {
    onCancel: () => {
      promptAborted = true;
    },
  });

  if (promptAborted) {
    console.log();
    console.log('Aborting ...');
    return;
  }

  console.log(
    `\nCreating a new ${chalk.cyan(
      results.projectType,
    )} project in ${chalk.green(workingDir)}\n`,
  );

  generateProject(results, workingDir);
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
  console.log(chalk.cyan('  npm run lint'));
  console.log('    Run the linter\n');
  console.log(chalk.cyan('  npm run build'));
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
}
