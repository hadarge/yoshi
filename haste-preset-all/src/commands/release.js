const LoggerPlugin = require('haste-plugin-wix-logger');

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {wnpmRelease} = tasks;

  await run(wnpmRelease());
};
