const JEST_WORKER_ID = parseInt(process.env.JEST_WORKER_ID, 10);

module.exports.PORT = 3100 + JEST_WORKER_ID;
module.exports.MANAGEMENT_PORT = 3200 + JEST_WORKER_ID;
module.exports.RPC_PORT = 3300 + JEST_WORKER_ID;
module.exports.APP_CONF_DIR = `./target/configs-${JEST_WORKER_ID}`;
