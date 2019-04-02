const fs = require('fs-extra');
const path = require('path');
const getFilesInDir = require('./getFilesInDir');
const replaceTemplates = require('./replaceTemplates');
const getValuesMap = require('./getValuesMap');

module.exports = (templateModel, workingDir) => {
  const valuesMap = getValuesMap(templateModel);
  const files = getFilesInDir(templateModel.getPath());

  for (const fileName in files) {
    const fullPath = path.join(workingDir, fileName);

    const transformed = replaceTemplates(files[fileName], valuesMap);
    const transformedPath = replaceTemplates(fullPath, valuesMap);

    fs.outputFileSync(transformedPath, transformed);
  }
};
