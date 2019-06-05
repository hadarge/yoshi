const constantCase = require('constant-case');
const pascalCase = require('pascal-case');

module.exports = ({ projectName, authorName, authorEmail }) => {
  const valuesMap = {
    projectName,
    authorName,
    authorEmail,
    gitignore: '.gitignore',
    packagejson: 'package.json',
  };

  for (const key in valuesMap) {
    // create CONSTANT_CASE entries for values map
    valuesMap[constantCase(key)] = constantCase(valuesMap[key]);

    // create PascalCase entries for values map
    valuesMap[pascalCase(key)] = pascalCase(valuesMap[key]);
  }

  return valuesMap;
};
