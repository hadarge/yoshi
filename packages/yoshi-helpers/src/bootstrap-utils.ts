import fs from 'fs';
import { NODE_PLATFORM_DEFAULT_CONFIGS_DIR } from 'yoshi-config/paths';

export const getEnvVars = ({
  port,
  appConfDir,
  appLogDir,
  appPersistentDir,
}: {
  port: number;
  appConfDir: string;
  appLogDir: string;
  appPersistentDir: string;
}) => {
  const PORT = Number(port) || 3000;
  const GRPC_PORT = PORT + 1;
  const MANAGEMENT_PORT = PORT + 4;
  const WNP_TEST_RPC_PORT = PORT + 2;
  const WNP_TEST_PETRI_PORT = PORT + 3;
  const WIX_BOOT_LABORATORY_URL = `http://localhost:${WNP_TEST_PETRI_PORT}`;

  return {
    PORT,
    GRPC_PORT,
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

export const getDevelopmentEnvVars = ({ port }: { port: number }) => {
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
