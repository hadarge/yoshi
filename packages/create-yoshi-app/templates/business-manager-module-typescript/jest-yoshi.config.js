const { environment } = require('./test/environment');

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
    setup: async ({ globalObject }) => {
      const env = await environment({ withRandomPorts: true });
      await env.start();
      globalObject.testKitEnv = env;
      // in tests we can just await testKitEnv.getUrl();
    },
    teardown: async ({ globalObject }) => {
      // take the env we created at setup() and stop it
      if (globalObject.testKitEnv) {
        await globalObject.testKitEnv.stop();
      }
    },
  },
  puppeteer: {
    // toggle headless chrome mode
    headless: true,
  },
};
