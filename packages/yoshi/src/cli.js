const fs = require('fs');
const { warnOnConfigValidationErrors } = require('../config/project');

const presetPath = require.resolve('../src/index.js');

module.exports = async command => {
  warnOnConfigValidationErrors();
  const appDirectory = fs.realpathSync(process.cwd());
  const action = require(`./commands/${command}`);

  try {
    const { persistent = false } = await action({
      context: presetPath,
      workerOptions: { cwd: appDirectory },
    });

    if (!persistent) {
      process.exit(0);
    }
  } catch (error) {
    if (error.name !== 'WorkerError') {
      console.error(error);
    }

    process.exit(1);
  }
};
