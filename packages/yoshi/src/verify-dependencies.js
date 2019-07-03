const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const resolveCwd = require('resolve-cwd');

const { version: yoshiVersion } = require('../package.json');

const relatedPackages = [
  'jest-yoshi-preset',
  'yoshi-style-dependencies',
  'yoshi-angular-dependencies',
];

module.exports = async () => {
  const outdatedPackages = relatedPackages
    .map(packageName => path.join(packageName, 'package.json'))
    .map(packageJsonPath => resolveCwd.silent(packageJsonPath))
    .filter(Boolean)
    .map(packageJsonFullPath => {
      const pkg = require(packageJsonFullPath);

      return {
        packageJsonFullPath,
        packageName: pkg.name,
        packageVersion: pkg.version,
      };
    })
    .filter(({ packageVersion }) => {
      const diff = semver.diff(packageVersion, yoshiVersion);

      return diff && diff.includes('major');
    });

  if (outdatedPackages.length > 0) {
    console.log(chalk.red('Command failed.\n'));
    console.log(
      chalk.red(
        'Packages related to Yoshi should be installed with the same major version as Yoshi:\n',
      ),
    );
    outdatedPackages.forEach(
      ({ packageJsonFullPath, packageName, packageVersion }) => {
        console.log(
          `  - ${chalk.bold.red(
            `${packageName} (${packageVersion}) at ${packageJsonFullPath}`,
          )}`,
        );
      },
    );
    console.log(
      chalk.red(
        `Please install them in the version ${chalk.bold(yoshiVersion)}.\n`,
      ),
    );

    process.exit(1);
  }
};
