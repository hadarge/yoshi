#! /usr/bin/env node

process.on('unhandledRejection', error => {
  throw error;
});

const fs = require('fs');
const { runPrompts, generateProject } = require('../src/index');

const workingDir = process.cwd();
const emptyDirectory = fs.readdirSync(workingDir).length === 0;

if (!emptyDirectory) {
  console.log(`The directory "${workingDir}" is not an empty directory\n`);
  console.log('Aborting...');

  process.exit(1);
}

const clearConsole = () => process.stdout.write('\x1Bc');

clearConsole();

runPrompts(workingDir).then(results => generateProject(results, workingDir));
