const fs = require('fs');
const verifyDependencies = require('yoshi-common/verify-dependencies');

const presetPath = require.resolve('../src/index.js');

// load can validate the config
require('yoshi-config');

module.exports = async command => {
  const appDirectory = fs.realpathSync(process.cwd());
  const action = require(`./commands/${command}`);

  await verifyDependencies();

  const { persistent = false } = await action({
    context: presetPath,
    workerOptions: { cwd: appDirectory },
  });

  if (!persistent) {
    process.exit(0);
  }
};
