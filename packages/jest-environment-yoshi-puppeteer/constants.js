const os = require('os');
const path = require('path');

module.exports.WS_ENDPOINT_PATH = path.join(
  os.tmpdir(),
  'jest_puppeteer_global_setup',
);
