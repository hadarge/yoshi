const NodeEnvironment = require('jest-environment-node');
const { getPort, appConfDir } = require('./constants');
const projectConfig = require('yoshi-config');
const { setupRequireHooks } = require('yoshi-helpers');

// the user's config is loaded outside of a jest runtime and should be transpiled
// with babel/typescript, this may be run separately for every worker
setupRequireHooks();

const jestYoshiConfig = require('yoshi-config/jest');

module.exports = class BootstrapEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // errors from environment setup/teardown are catched silently
    try {
      await jestYoshiConfig.bootstrap.setup({
        globalObject: this.global,
        getPort,
        staticsUrl: projectConfig.servers.cdn.url,
        appConfDir,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async teardown() {
    await super.teardown();

    try {
      await jestYoshiConfig.bootstrap.teardown({
        globalObject: this.global,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
