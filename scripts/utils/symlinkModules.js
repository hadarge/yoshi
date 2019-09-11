const fs = require('fs-extra');
const path = require('path');

module.exports = repoDirectory => {
  const parentDirectory = path.dirname(repoDirectory);

  const symlinkPackage = packageName => {
    fs.removeSync(path.join(repoDirectory, 'node_modules', packageName));
    fs.ensureSymlinkSync(
      path.join(__dirname, '../../packages', packageName),
      path.join(repoDirectory, 'node_modules', packageName),
    );
  };

  // Link yoshi's node_modules to the parent directory of the tested module
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/yoshi/node_modules'),
    path.join(parentDirectory, 'node_modules'),
  );

  // Link yoshi's `.bin` to the parent directory of the tested module
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/yoshi/bin/yoshi.js'),
    path.join(parentDirectory, 'node_modules/.bin/yoshi'),
  );

  [
    'yoshi',
    'jest-yoshi-preset',
    'yoshi-server',
    'yoshi-server-client',
    'yoshi-server-tools',
    'yoshi-server-react',
    'yoshi-server-testing',
  ].forEach(symlinkPackage);
};
