const fs = require('fs');
const path = require('path');
const globby = require('globby');

module.exports = absoluteDirPath => {
  const filesPaths = globby.sync(['**/*', '!node_modules'], {
    cwd: absoluteDirPath,
    dot: true,
    gitignore: true,
  });

  const files = {};

  filesPaths.forEach(filePath => {
    const content = fs.readFileSync(
      path.join(absoluteDirPath, filePath),
      'utf-8',
    );

    files[filePath] = content;
  });

  return files;
};
