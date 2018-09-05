const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { validate } = require('jest-validate');

const loadConfig = () => {
  const configPath = path.join(process.cwd(), 'jest-yoshi.config.js');

  if (!fs.existsSync(configPath)) {
    // use default config
    return {};
  }

  let config;

  try {
    config = require(configPath);
  } catch (error) {
    throw new Error(
      `Config ${chalk.bold(configPath)} is invalid:\n  ${error.message}`,
    );
  }

  validate(config, {
    recursiveBlacklist: ['puppeteer'],
    exampleConfig: {
      bootstrap: {
        setup: async () => {},
        teardown: async () => {},
      },
      server: {
        command: 'node index.js',
        port: 1234,
      },
    },
    comment:
      'Please refer to https://github.com/wix/yoshi for more information...',
  });

  return config;
};

module.exports = loadConfig();
