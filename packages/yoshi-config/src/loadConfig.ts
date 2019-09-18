import readPkg from 'read-pkg';
import cosmiconfig from 'cosmiconfig';
import { defaultsDeep } from 'lodash';
import { validate as validateConfig } from 'jest-validate';
import { Config, InitialConfig } from './config';
import validConfig from './validConfig';
import normalize from './normalize';

const explorer = cosmiconfig('yoshi', {
  searchPlaces: ['package.json', 'yoshi.config.js'],
});

export default ({ validate = true, cwd = process.cwd() } = {}): Config => {
  const result = explorer.searchSync(cwd);
  const initialConfig = <InitialConfig>(result ? result.config : {});

  // Load and copy values from a file that extends the config
  if (initialConfig.extends) {
    const extendsConfig: Partial<InitialConfig> = require(initialConfig.extends)
      .defaultConfig;

    defaultsDeep(initialConfig, extendsConfig);
  }

  // Validate correctness
  if (validate) {
    validateConfig(initialConfig, {
      exampleConfig: validConfig,
      recursiveBlacklist: ['resolveAlias'],
    });
  }

  // Load package.json
  const pkgJson = readPkg.sync({ cwd });

  // Normalize values
  const config = normalize(initialConfig, pkgJson);

  return config;
};
