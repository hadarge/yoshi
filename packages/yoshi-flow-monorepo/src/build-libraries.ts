import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import chalk from 'chalk';
import globby from 'globby';
import { BUILD_DIR } from 'yoshi-config/paths';
import { PackageGraphNode } from './load-package-graph';

export default async function buildLibs(libs: Array<PackageGraphNode>) {
  const libsLocations = libs.map(lib => lib.location);

  try {
    await execa(`npx tsc -b ${libsLocations.join(' ')}`, {
      stdio: 'inherit',
      shell: true,
    });
  } catch (error) {
    console.log(chalk.red('Failed to compile.\n'));
    console.error(error.stack);

    process.exit(1);
  }

  libs.forEach(lib => {
    const assets = globby.sync('src/**/*', {
      cwd: lib.location,
      ignore: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'],
    });

    assets.forEach(assetPath => {
      const dirname = path.join(lib.location, BUILD_DIR, assetPath);

      fs.ensureDirSync(path.dirname(dirname));
      fs.copyFileSync(path.join(lib.location, assetPath), dirname);
    });
  });
}
