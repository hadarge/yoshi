const cosmiconfig = require('cosmiconfig');
const get = require('lodash/get');

const explorer = cosmiconfig('yoshi', {
  rc: false,
  sync: true,
});

module.exports = () => {
  const projectConfig = get(explorer.load(), 'config', {});

  if (projectConfig.extends) {
    const extendsConfig = require(projectConfig.extends);

    return {
      ...extendsConfig.defaultConfig,
      ...projectConfig,
    };
  }

  return projectConfig;
};
