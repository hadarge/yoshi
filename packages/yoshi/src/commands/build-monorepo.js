process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const globby = require('globby');
const execa = require('execa');
const { splitPackagesPromise } = require('./utils');

module.exports = async () => {
  const [apps, libs] = await splitPackagesPromise;

  console.log(chalk.bold.cyan('Building packages...'));
  console.log();

  const libsLocations = libs.map(lib => lib.location);

  await execa.shell(`npx tsc -b ${libsLocations.join(' ')}`, {
    stdio: 'inherit',
  });

  console.log(chalk.bold.cyan('Copying non-js files...'));
  console.log();

  libsLocations.forEach(packageDirectory => {
    const assets = globby.sync('src/**/*', {
      cwd: packageDirectory,
      ignore: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'],
    });

    assets.forEach(assetPath => {
      fs.copyFileSync(
        path.join(packageDirectory, assetPath),
        path.join(packageDirectory, 'dist', assetPath),
      );
    });
  });

  console.log(chalk.bold.cyan('Building bundle...'));
  console.log();

  if (apps.length !== 1) {
    console.log(
      chalk.bold.red('Currently, Yoshi only support monorepos with one app.'),
    );
    console.log();

    process.exit(1);
  }

  await execa.shell(`npx lerna exec --scope ${apps[0].name} -- npm run build`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      EXPERIMENTAL_MONOREPO_SUB_PROCESS: true,
    },
  });

  console.log();
  console.log(chalk.bold.green('Done!'));

  return {
    persistent: false,
  };
};
