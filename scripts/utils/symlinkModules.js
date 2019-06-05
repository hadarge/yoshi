const fs = require('fs-extra');
const path = require('path');

module.exports = repoDirectory => {
  const parentDirectory = path.dirname(repoDirectory);

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

  // Link yoshi to the node_modules of the tested module
  fs.removeSync(path.join(repoDirectory, 'node_modules/yoshi'));
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/yoshi'),
    path.join(repoDirectory, 'node_modules/yoshi'),
  );

  // Link jest-yoshi-preset to the node_modules of the tested module
  fs.removeSync(path.join(repoDirectory, 'node_modules/jest-yoshi-preset'));
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../packages/jest-yoshi-preset'),
    path.join(repoDirectory, 'node_modules/jest-yoshi-preset'),
  );
};
