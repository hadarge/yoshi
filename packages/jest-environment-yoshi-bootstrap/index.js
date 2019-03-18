const NodeEnvironment = require('jest-environment-node');
const {
  getPort,
  appConfDir,
  appLogDir,
  appPersistentDir,
} = require('./constants');
const projectConfig = require('yoshi-config');

module.exports = class BootstrapEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // create sensible defaults for bootstrap environment's process.env
    const appPort = getPort();

    Object.assign(this.global.process.env, {
      PORT: appPort,
      MANAGEMENT_PORT: appPort + 1,
      APP_CONF_DIR: appConfDir,
      APP_LOG_DIR: appLogDir,
      APP_PERSISTENT_DIR: appPersistentDir,
      APP_TEMPL_DIR: './templates',
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: '',
    });

    // errors from environment setup/teardown are catched silently
    try {
      if (this.global.__setup__) {
        await this.global.__setup__({
          globalObject: this.global,
          getPort,
          staticsUrl: projectConfig.servers.cdn.url,
          appConfDir,
          appLogDir,
          appPersistentDir,
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async teardown() {
    await super.teardown();

    try {
      if (this.global.__teardown__) {
        await this.global.__teardown__({
          globalObject: this.global,
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
