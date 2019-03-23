const fs = require('fs');
const { NODE_PLATFORM_DEFAULT_CONFIGS_DIR } = require('yoshi-config/paths');

module.exports.getEnvironmentParams = ({
  port,
  appConfDir,
  appLogDir,
  appPersistentDir,
}) => {
  // Check if the project has the default directory for loading node platform
  // configs

  // If it exists, the project is not using the `index-dev.js` pattern and we
  // keep the defaults
  //
  // Otherwise, we inject our own defaults to keep boilerplate to a minimum
  //
  // If an appConfDir supplied, we don't want to check at all
  // https://github.com/wix/yoshi/pull/1153
  if (!appConfDir && fs.existsSync(NODE_PLATFORM_DEFAULT_CONFIGS_DIR)) {
    return {};
  }

  const defaultConfigDir = './target/dev/configs';
  const defaultLogDif = './target/dev/logs';
  const defaultPersistentDir = './target/dev/persistent';
  const defaultTemplatesDir = './templates';

  const PORT = Number(port) || 3000;
  const MANAGEMENT_PORT = PORT + 1;
  const WNP_TEST_RPC_PORT = PORT + 2;
  const WNP_TEST_PETRI_PORT = PORT + 3;
  const WIX_BOOT_LABORATORY_URL = `http://localhost:${WNP_TEST_PETRI_PORT}`;

  return {
    PORT,
    MANAGEMENT_PORT,
    WNP_TEST_RPC_PORT,
    WNP_TEST_PETRI_PORT,
    WIX_BOOT_LABORATORY_URL,
    APP_CONF_DIR: appConfDir || defaultConfigDir,
    APP_LOG_DIR: appLogDir || defaultLogDif,
    APP_PERSISTENT_DIR: appPersistentDir || defaultPersistentDir,
    APP_TEMPL_DIR: defaultTemplatesDir,
    NEW_RELIC_LOG_LEVEL: 'warn',
  };
};
