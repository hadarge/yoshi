const fs = require('fs-extra');
const { WS_ENDPOINT_PATH } = require('./constants');
const { shouldRunE2Es } = require('./utils');

module.exports = async () => {
  if (await shouldRunE2Es()) {
    await fs.remove(WS_ENDPOINT_PATH);

    await global.BROWSER.close();

    if (global.SERVER) {
      global.SERVER.kill();
    }
  }
};
