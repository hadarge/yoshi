const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk');
const globby = require('globby');

module.exports = async function buildLibs(libs) {
  // Clean tmp folders
  await Promise.all(
    libs.map(app => {
      return fs.emptyDir(app.BUILD_DIR);
    }),
  );

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

  // Build source code for publishing
  const scopeFlags = libs.map(lib => `--scope=${lib.name}`);

  try {
    await execa.shell(`npx lerna exec ${scopeFlags.join(' ')} -- npx tsc`);
  } catch (error) {
    console.log(chalk.red('Failed to compile.\n'));
    console.error(error.stack);

    process.exit(1);
  }
};
