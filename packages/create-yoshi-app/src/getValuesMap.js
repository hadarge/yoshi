const constantCase = require('constant-case');

module.exports = ({ projectName, authorName, authorEmail, organization }) => {
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

  return valuesMap;
};
