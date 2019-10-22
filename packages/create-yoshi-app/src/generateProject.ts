import path from 'path';
import { outputFileSync } from 'fs-extra';
import getFilesInDir from './getFilesInDir';
import replaceTemplates from './replaceTemplates';
import getValuesMap from './getValuesMap';
import TemplateModel from './TemplateModel';

export default (templateModel: TemplateModel, workingDir: string) => {
  const valuesMap = getValuesMap(templateModel);
  const files = getFilesInDir(templateModel.getPath());

  Object.keys(files).forEach(fileName => {
    const fullPath = path.join(workingDir, fileName);

    const transformed = replaceTemplates(files[fileName], valuesMap);
    const transformedPath = replaceTemplates(fullPath, valuesMap);

    outputFileSync(transformedPath, transformed);
  });
};
