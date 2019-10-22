import constantCase from 'constant-case';
import pascalCase from 'pascal-case';
import TemplateModel from './TemplateModel';

export default ({ projectName, authorName, authorEmail }: TemplateModel) => {
  const valuesMap: Record<string, string> = {
    projectName,
    authorName,
    authorEmail,
    gitignore: '.gitignore',
    packagejson: 'package.json',
  };

  Object.keys(valuesMap).forEach(key => {
    // create CONSTANT_CASE entries for values map
    valuesMap[constantCase(key)] = constantCase(valuesMap[key]);

    // create PascalCase entries for values map
    valuesMap[pascalCase(key)] = pascalCase(valuesMap[key]);
  });

  return valuesMap;
};
