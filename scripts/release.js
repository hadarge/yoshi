process.on('unhandledRejection', error => {
  throw error;
});

const prompts = require('prompts');
const chalk = require('chalk');
const pkg = require('../package.json');
const path = require('path');
const npPath = path.resolve(__dirname, '../node_modules/.bin/np');
const cp = require('child_process');

// resets the console
process.stdout.write('\x1Bc');

console.log(chalk.underline(`starting the release process for ${pkg.name}`));
console.log();

prompts({
  type: 'confirm',
  name: 'value',
  initial: true,
  message: 'Did you remember to update changelog with the new version?'
}).then(({value}) => {
  if (!value) {
    console.log();
    console.log(chalk.red('Release canceled'));
  } else {
    cp.execSync(`${npPath} --yolo --no-publish --no-yarn`, {stdio: 'inherit'});

    console.log();
    console.log(chalk.green('release process succeeded'));
    console.log();
    console.log('publish will occure if all tests are passed,');
    console.log('head over to the CI and search for yoshi build.');
    console.log('http://ci.dev.wix/viewType.html?buildTypeId=Wix_Angular_WixHaste_HastePresetYoshi');
  }
});
