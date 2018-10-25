const NodeEnvironment = require('jest-environment-node');
const { getPort, appConfDir } = require('./constants');
const projectConfig = require('yoshi-config');

module.exports = class BootstrapEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // errors from environment setup/teardown are catched silently
    try {
      if (this.global.__setup__) {
        await this.global.__setup__({
          globalObject: this.global,
          getPort,
          staticsUrl: projectConfig.servers.cdn.url,
          appConfDir,
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
