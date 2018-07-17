const fs = require('fs-extra');
const { WS_ENDPOINT_PATH } = require('./constants');

module.exports = async () => {
  await fs.remove(WS_ENDPOINT_PATH);
  await global.BROWSER.close();
};
