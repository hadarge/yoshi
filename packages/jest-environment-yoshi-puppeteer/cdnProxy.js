const startRewriteForwardProxy = require('yoshi-helpers/rewrite-forward-proxy');
const { getProjectCDNBasePath } = require('yoshi-helpers');
const { servers } = require('yoshi-config');

let closeProxy;

module.exports.start = async function start(port) {
  closeProxy = await startRewriteForwardProxy({
    search: getProjectCDNBasePath(),
    rewrite: servers.cdn.url,
    port,
  });
};

module.exports.stop = async function stop() {
  closeProxy && (await closeProxy());
};
