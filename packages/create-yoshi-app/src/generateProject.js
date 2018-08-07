const fs = require('fs-extra');
const path = require('path');
const getFilesInDir = require('./getFilesInDir');
const replaceTemplates = require('./replaceTemplates');
const constantCase = require('constant-case');

module.exports = (
  {
    authorName,
    authorEmail,
    organization,
    projectType,
    transpiler,
    projectName,
  },
  workingDir,
) => {
  const typescriptSuffix = transpiler === 'typescript' ? '-typescript' : '';
  const templatePath = path.join(
    __dirname,
    '../templates',
    projectType + typescriptSuffix,
  );

  const valuesMap = {
    projectName,
    authorName,
    authorEmail,
    organization,
    gitignore: '.gitignore',
    packagejson: 'package.json',
  };

  for (const key in valuesMap) {
    // create CONSTANT_CASE entries for values map
    valuesMap[constantCase(key)] = constantCase(valuesMap[key]);
  }

  const files = getFilesInDir(templatePath);

  for (const fileName in files) {
    const fullPath = path.join(workingDir, fileName);

    const transformed = replaceTemplates(files[fileName], valuesMap);
    const transformedPath = replaceTemplates(fullPath, valuesMap);

    fs.outputFileSync(transformedPath, transformed);
  }
};
