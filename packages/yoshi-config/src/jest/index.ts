import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import importFresh from 'import-fresh';
import { validate } from 'jest-validate';
import validConfig from './validConfig';
import { Config } from './config';

export default (): Config => {
  const configPath = path.join(process.cwd(), 'jest-yoshi.config.js');

  // use default config
  if (!fs.existsSync(configPath)) {
    return {};
  }

  let config;

  try {
    config = importFresh(configPath) as any;
  } catch (error) {
    error.message = `Config ${chalk.bold(configPath)} is invalid:\n  ${
      error.message
    }`;
    throw error;
  }

  validate(config, {
    exampleConfig: validConfig,
    recursiveBlacklist: [
      'puppeteer',
      'specOptions.globals',
      'specOptions.moduleNameMapper',
      'e2eOptions.globals',
      'coverageThreshold',
    ],
  });

  return config;
};
