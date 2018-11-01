const testkit = require('wix-bootstrap-testkit');
const configEmitter = require('wix-config-emitter');

module.exports.emitConfigs = ({ targetFolder }) => {
  const emitter = configEmitter({
    sourceFolders: ['./templates'],
    targetFolder,
  });

  return emitter.fn('scripts_domain', 'static.parastorage.com').emit();
};

module.exports.bootstrapServer = ({ port, managementPort, appConfDir }) => {
  return testkit.app('./index', {
    env: {
      PORT: port,
      MANAGEMENT_PORT: managementPort,
      NEW_RELIC_LOG_LEVEL: 'warn',
      APP_CONF_DIR: appConfDir,
      DEBUG: '',
    },
  });
};
