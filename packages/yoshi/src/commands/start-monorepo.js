process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const execa = require('execa');
const chokidar = require('chokidar');
const { splitPackagesPromise } = require('./utils');

module.exports = async () => {
  const [apps, libs] = await splitPackagesPromise;

  libs.forEach(lib => {
    const packageDirectory = lib.location;

    const watcher = chokidar.watch('src/**/*', {
      cwd: packageDirectory,
      ignored: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'],
    });

    const copyAsset = assetPath => {
      const targetFilePath = path.join(packageDirectory, 'dist', assetPath);

      fs.ensureFileSync(targetFilePath);

      fs.copyFileSync(path.join(packageDirectory, assetPath), targetFilePath);
    };

    watcher
      .on('add', copyAsset)
      .on('rename', copyAsset)
      .on('change', copyAsset);

    watcher.on('unlink', assetPath => {
      fs.removeSync(path.join(packageDirectory, 'dist', assetPath));
    });
  });

  if (apps.length !== 1) {
    console.log(
      chalk.bold.red('Currently, Yoshi only support monorepos with one app.'),
    );
    console.log();

    process.exit(1);
  }

  execa.shell(`lerna exec --scope=${apps[0].name} -- yarn start`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      EXPERIMENTAL_MONOREPO_SUB_PROCESS: true,
    },
  });

  return {
    persistent: true,
  };
};
