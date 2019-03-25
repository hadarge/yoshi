const fs = require('fs');
const { NODE_PLATFORM_DEFAULT_CONFIGS_DIR } = require('yoshi-config/paths');

const getEnvVars = ({ port, appConfDir, appLogDir, appPersistentDir }) => {
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
    APP_CONF_DIR: appConfDir,
    APP_LOG_DIR: appLogDir,
    APP_PERSISTENT_DIR: appPersistentDir,
    APP_TEMPL_DIR: './templates',
    NEW_RELIC_LOG_LEVEL: 'warn',
  };
};

const getDevelopmentEnvVars = ({ port }) => {
  // Check if the project has the default directory for loading node platform
  // configs. If it exists, the project is not using the `index-dev.js` pattern and we
  // keep the defaults. Otherwise, we inject our own defaults to keep boilerplate to a minimum.
  if (fs.existsSync(NODE_PLATFORM_DEFAULT_CONFIGS_DIR)) {
    return {};
  }

  const envVars = getEnvVars({
    port,
    appConfDir: './target/dev/configs',
    appLogDir: './target/dev/logs',
    appPersistentDir: './target/dev/persistent',
  });

  return envVars;
};

module.exports = { getEnvVars, getDevelopmentEnvVars };
