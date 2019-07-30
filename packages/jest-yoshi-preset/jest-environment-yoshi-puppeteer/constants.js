const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports.WS_ENDPOINT_PATH = path.join(DIR, 'wsEndpoint');
