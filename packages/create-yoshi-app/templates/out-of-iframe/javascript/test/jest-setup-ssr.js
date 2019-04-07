const { globalSetup } = require('@wix/santa-site-renderer-testkit');

module.exports = globalConfig =>
  globalSetup(globalConfig, { reactSource: 'GA' });
