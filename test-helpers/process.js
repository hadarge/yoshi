const psTree = require('ps-tree');

function killSpawnProcessAndHisChildren(child) {
  return new Promise(resolve => {
    if (!child) {
      return resolve();
    }

    const pid = child.pid;

    psTree(pid, (err /*eslint handle-callback-err: 0*/, children) => {
      [pid].concat(children.map(p => p.PID)).forEach(tpid => {
        try {
          process.kill(tpid, 'SIGKILL');
        } catch (e) {}
      });

      child = null;
      resolve();
    });
  });
}

module.exports = { killSpawnProcessAndHisChildren };
