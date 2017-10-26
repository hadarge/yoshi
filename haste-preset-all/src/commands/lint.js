const LoggerPlugin = require('haste-plugin-wix-logger');
const globs = require('../globs');

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {read, eslint} = tasks;

  await run(
    read({pattern: ['*.js', `${globs.base()}/**/*.js`]}),
    eslint()
  );
};
