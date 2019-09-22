const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk');
const globby = require('globby');

module.exports = async function buildLibs(libs) {
  // Build source code for publishing
  const libsLocations = libs.map(lib => lib.location);

  try {
    await execa.shell(`npx tsc -b ${libsLocations.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log(chalk.red('Failed to compile.\n'));
    console.error(error.stack);

    process.exit(1);
  }

  // Copy non-js assets
  libs.forEach(lib => {
    const assets = globby.sync('src/**/*', {
      cwd: lib.ROOT_DIR,
      ignore: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'],
    });

    assets.forEach(assetPath => {
      const dirname = path.join(lib.BUILD_DIR, assetPath);

      fs.ensureDirSync(path.dirname(dirname));
      fs.copyFileSync(path.join(lib.ROOT_DIR, assetPath), dirname);
    });
  });
};
