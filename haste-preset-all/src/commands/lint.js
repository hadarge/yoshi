const parseArgs = require('minimist');
const LoggerPlugin = require('haste-plugin-wix-logger');
const globs = require('../globs');
const {isTypescriptProject, shouldRunStylelint} = require('../utils');

const cliArgs = parseArgs(process.argv.slice(2));

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {read, eslint, tslint, stylelint} = tasks;

  if (shouldRunStylelint()) {
    await run(
      read({pattern: [`${globs.base()}/**/*.scss`, `${globs.base()}/**/*.less`]}),
      stylelint({formatter: 'string'})
    );
  }

  if (isTypescriptProject()) {
    await run(
      read({pattern: [`${globs.base()}/**/*.ts{,x}`]}),
      tslint({fix: false, formatter: 'prose'})
    );
  } else {
    await run(
      read({pattern: ['*.js', `${globs.base()}/**/*.js`]}),
      eslint({cache: true, cacheLocation: 'target/.eslintcache', fix: cliArgs.fix})
    );
  }
};
