const fs = require('fs');
const path = require('path');
const globby = require('globby');

module.exports = absoulteDirPath => {
  const filesPaths = globby.sync('**/*', {
    cwd: absoulteDirPath,
    dot: true,
    gitignore: true,
  });

  const files = {};

  filesPaths.forEach(filePath => {
    const content = fs.readFileSync(
      path.join(absoulteDirPath, filePath),
      'utf-8',
    );

    files[filePath] = content;
  });

  return files;
};
