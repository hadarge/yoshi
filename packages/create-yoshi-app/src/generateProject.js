const fs = require('fs-extra');
const path = require('path');
const getFilesInDir = require('./getFilesInDir');
const replaceTemplates = require('./replaceTemplates');
const getValuesMap = require('./getValuesMap');

module.exports = (answers, workingDir) => {
  const valuesMap = getValuesMap(answers);
  const files = getFilesInDir(answers.templatePath);

  for (const fileName in files) {
    const fullPath = path.join(workingDir, fileName);

    const transformed = replaceTemplates(files[fileName], valuesMap);
    const transformedPath = replaceTemplates(fullPath, valuesMap);

    fs.outputFileSync(transformedPath, transformed);
  }
};
