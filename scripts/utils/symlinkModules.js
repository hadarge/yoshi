const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

module.exports.getYoshiModulesList = () => {
  const { stdout: rawPackages } = execa.sync('npx lerna list --all --json', {
    shell: true,
  });

  return JSON.parse(rawPackages).map(x => x.name);
};

module.exports.symlinkModules = repoDirectory => {
  const parentDirectory = path.dirname(repoDirectory);

  // Link yoshi's node_modules to the parent directory of the tested module
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/yoshi-flow-legacy/node_modules'),
    path.join(parentDirectory, 'node_modules'),
  );

  // Link yoshi's `.bin` to the parent directory of the tested module
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/yoshi/bin/yoshi-cli.js'),
    path.join(parentDirectory, 'node_modules/.bin/yoshi'),
  );

  const symlinkPackage = packageName => {
    fs.removeSync(path.join(repoDirectory, 'node_modules', packageName));
    fs.ensureSymlinkSync(
      path.join(__dirname, '../../packages', packageName),
      path.join(repoDirectory, 'node_modules', packageName),
    );
  };

  const packageJsonPath = path.join(repoDirectory, 'package.json');
  const pkg = fs.readJsonSync(packageJsonPath);

  const projectDependencies = [];

  if (pkg.dependencies) {
    projectDependencies.push(...Object.keys(pkg.dependencies));
  }

  if (pkg.devDependencies) {
    projectDependencies.push(...Object.keys(pkg.devDependencies));
  }

  exports
    .getYoshiModulesList()
    // only symlink yoshi modules which are project dependencies
    .filter(moduleName => projectDependencies.includes(moduleName))
    .forEach(symlinkPackage);
};
