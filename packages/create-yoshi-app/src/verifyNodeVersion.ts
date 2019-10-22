import path from 'path';
import fs from 'fs';
import semver from 'semver';
import chalk from 'chalk';

export default () => {
  const nvmrcPath = path.join(__dirname, '../.nvmrc');

  const requiredVersion = fs
    .readFileSync(nvmrcPath)
    .toString()
    .trim();

  const nodeVersion = process.version;

  if (!semver.satisfies(nodeVersion, requiredVersion)) {
    console.log(
      `Node version ${chalk.cyan(
        nodeVersion,
      )} does not match required version of ${chalk.cyan(requiredVersion)}\n`,
    );
    console.log('Aborting...');

    process.exit(1);
  }
};
