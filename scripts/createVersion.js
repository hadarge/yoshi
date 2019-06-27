const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const semver = require('semver');
const prompts = require('prompts');
const pkg = require('../package.json');
const fs = require('fs');

const websiteDirectory = path.resolve(__dirname, '../website');
const lernaPath = path.resolve(__dirname, '../node_modules/.bin/lerna');

// resets the console
process.stdout.write('\x1Bc');

console.log(chalk.underline(`starting the release process for ${pkg.name}`));
console.log();

Promise.resolve()
  // Ask to create changelog
  .then(() =>
    prompts({
      type: 'confirm',
      name: 'value',
      initial: true,
      message: 'Did you remember to update changelog with the new version?',
    }),
  )
  .then(({ value }) => {
    if (!value) {
      console.log();
      console.log(chalk.cyan('So do it now 👇'));
      console.log();
      console.log(path.resolve(__dirname, '../CHANGELOG.md'));
      console.log();
      console.log(chalk.red('Release aborted'));

      process.exit(1);
    }
  })
  // Create new tag/bump versions in `package.json` files
  .then(() => {
    execa.shellSync(`${lernaPath} version --exact --no-push`, {
      stdio: 'inherit',
    });
  })
  // Update docs according to new version
  .then(() => {
    const lernaJson = require('../lerna.json');
    const monorepoVersion = lernaJson.version;
    const majorVersion = `${semver.major(monorepoVersion)}.x`;

    // In case the index of the major version already exist in versions.json remove it
    // https://github.com/wix/yoshi/issues/1228
    const versionsJsonPath = require.resolve('../website/versions.json');
    const versionsJson = require(versionsJsonPath);
    const indexOfVersion = versionsJson.indexOf(majorVersion);
    if (indexOfVersion !== -1) {
      versionsJson.splice(indexOfVersion, 1);
      fs.writeFileSync(versionsJsonPath, JSON.stringify(versionsJson, null, 2));
      console.log();
      console.log(`version "${majorVersion}" already exist, overriding...`);
      console.log();
    }

    const createVersionedDocsCommand = `npm run version "${majorVersion}"`;

    execa.shellSync(createVersionedDocsCommand, {
      cwd: websiteDirectory,
      stdio: 'inherit',
    });

    const numberOfModifiedFiles = execa
      .shellSync(`git ls-files -m | wc -l`)
      .stdout.trim();

    if (numberOfModifiedFiles === '0') {
      console.log();
      console.log(
        `no changes created after running "${createVersionedDocsCommand}"`,
      );
      console.log();
    } else {
      execa.shellSync(
        `git commit -a -m "documentation for version ${majorVersion}"`,
      );
    }
  })
  .then(() => {
    console.log();
    console.log(chalk.green('Release was created locally'));
    console.log();
    console.log('Please push your changes to origin');
    console.log();
    console.log(chalk.cyan('git push --follow-tags'));
    console.log();
    console.log('Head over to the CI and wait for yoshi build to pass 👇');
    console.log();
    console.log(
      chalk.cyan(
        'http://ci.dev.wix/viewType.html?buildTypeId=Wix_Angular_WixHaste_HastePresetYoshi',
      ),
    );
  })
  .catch(error => {
    console.log(chalk.red('Version release failed.'));
    console.log(chalk.red(error.stack));
    console.log();

    process.exit(1);
  });
