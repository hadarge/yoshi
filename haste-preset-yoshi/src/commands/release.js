const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {wixWnpmRelease} = tasks;

  await run(wixWnpmRelease());
};
