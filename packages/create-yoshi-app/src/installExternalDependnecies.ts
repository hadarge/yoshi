import path from 'path';
import fs from 'fs-extra';
import { PackageJson } from 'type-fest';
import { npmInstall } from './utils';

export default (workingDir: string, localDependencies: Array<string>) => {
  const packageJsonPath = path.join(workingDir, 'package.json');
  const backupPath = path.join(workingDir, 'package.json.backup');

  // create backup to package.json
  fs.copySync(packageJsonPath, backupPath);

  // mutates package.json
  removeDependencies(packageJsonPath, localDependencies);

  npmInstall(workingDir);

  // remove mutated package.json
  fs.removeSync(packageJsonPath);

  // restore original package.json from backup
  fs.renameSync(backupPath, packageJsonPath);
};

function removeDependencies(
  packageJsonPath: string,
  dependeciesToRemove: Array<string>,
) {
  const pkg: PackageJson = fs.readJsonSync(packageJsonPath);

  if (pkg.dependencies) {
    for (const dependencyName of Object.keys(pkg.dependencies)) {
      if (dependeciesToRemove.includes(dependencyName)) {
        delete pkg.dependencies[dependencyName];
      }
    }
  }

  if (pkg.devDependencies) {
    for (const dependencyName of Object.keys(pkg.devDependencies)) {
      if (dependeciesToRemove.includes(dependencyName)) {
        delete pkg.devDependencies[dependencyName];
      }
    }
  }

  fs.removeSync(packageJsonPath);

  fs.writeJsonSync(packageJsonPath, pkg, { spaces: 2 });
}
