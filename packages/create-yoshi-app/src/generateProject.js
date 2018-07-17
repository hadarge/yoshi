const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const getFilesInDir = require('./getFilesInDir');
const replaceTemplates = require('./replaceTemplates');
const constantCase = require('constant-case');

module.exports = (
  {
    projectName,
    authorName,
    authorEmail,
    organization,
    projectType,
    transpiler,
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
  };

  for (const key in valuesMap) {
    // create CONSTANT_CASE entries for values map
    valuesMap[constantCase(key)] = constantCase(valuesMap[key]);
  }

  const files = getFilesInDir(templatePath);

  for (const fileName in files) {
    const fullPath = path.join(workingDir, fileName);
    mkdirp.sync(path.dirname(fullPath));

    const transformed = replaceTemplates(files[fileName], valuesMap);
    const transformedPath = replaceTemplates(fullPath, valuesMap);

    fs.writeFileSync(transformedPath, transformed);
  }
};
