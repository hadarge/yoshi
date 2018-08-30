const { emitConfigs, bootstrapServer } = require('./test/environment');

// The purpose of this file is to start your server and possibly additional servers
// like RPC/Petri servers.
//
// Because tests are running in parallel, it should start a different server on a different port
// for every test file (E2E and server tests).
//
// By attaching the server object (testkit result) on `globalObject` it will be available to every
// test file globally by that name.
module.exports = {
  bootstrap: {
    setup: async ({ globalObject, getPort, appConfDir }) => {
      await emitConfigs({ targetFolder: appConfDir });

      globalObject.app = bootstrapServer({
        port: getPort(),
        managementPort: getPort(),
        appConfDir,
      });

      await globalObject.app.start();
    },
    teardown: async ({ globalObject }) => {
      await globalObject.app.stop();
    },
  },
};
