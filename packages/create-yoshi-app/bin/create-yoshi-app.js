#! /usr/bin/env node

process.on('unhandledRejection', error => {
  throw error;
});

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const verifyDirectoryName = require('../src/verifyDirectoryName');
const { createApp } = require('../src/index');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .arguments('[project-directory]')
  .usage(chalk.cyan('[project-directory]'))
  .parse(process.argv);

const customProjectDir = program.args[0];
const workingDir = process.cwd();

verifyDirectoryName(customProjectDir || workingDir);

if (customProjectDir) {
  fs.ensureDirSync(customProjectDir);
  process.chdir(path.resolve(customProjectDir));
}

createApp(workingDir, customProjectDir);
