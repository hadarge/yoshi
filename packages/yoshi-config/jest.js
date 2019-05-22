const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const validateConfig = require('./utils/validate-config');
const schema = require('./schema/jest-yoshi-config-schema.json');
const YoshiOptionsValidationError = require('./utils/YoshiOptionsValidationError');
const importFresh = require('import-fresh');

const loadConfig = () => {
  const configPath = path.join(process.cwd(), 'jest-yoshi.config.js');

  if (!fs.existsSync(configPath)) {
    // use default config
    return {};
  }

  let config;

  try {
    config = importFresh(configPath);
  } catch (error) {
    error.message = `Config ${chalk.bold(configPath)} is invalid:\n  ${
      error.message
    }`;
    throw error;
  }

  try {
    validateConfig(config, schema);
  } catch (err) {
    if (err instanceof YoshiOptionsValidationError) {
      console.log();
      console.warn(chalk.yellow('Warning: ' + err.message));
      console.log();
    } else {
      throw err;
    }
  }

  return config;
};

module.exports = loadConfig;
