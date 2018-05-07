if (process.env.IS_BUILD_AGENT) {
  console.log('Yoshi release script should not run in CI. Exiting...');
  process.exit(0);
}
process.on('unhandledRejection', error => {
  throw error;
});

const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');
const rimraf = require('rimraf');
const cp = require('child_process');
const pkg = require('../package.json');
const npPath = path.resolve(__dirname, '../node_modules/.bin/np');
const packageLockPath = path.resolve(__dirname, '../package-lock.json');

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
    console.log(chalk.cyan('So do it now 👇'));
    console.log();
    console.log(path.resolve(__dirname, '../CHANGELOG.md'));
    console.log();
    console.log(chalk.red('Release aborted'));
  } else {
    try {
      // np will not publish if there is a package-lock.json
      rimraf.sync(packageLockPath);

      cp.execSync(`${npPath} --yolo --no-publish --no-yarn`, {stdio: 'inherit'});

      console.log();
      console.log(chalk.green('release process succeeded'));
      console.log();
      console.log('publish will occure if all tests are passed,');
      console.log('head over to the CI and search for yoshi build 👇');
      console.log();
      console.log('http://ci.dev.wix/viewType.html?buildTypeId=Wix_Angular_WixHaste_HastePresetYoshi');
    } catch (error) {
      throw error;
    }

  }
});
