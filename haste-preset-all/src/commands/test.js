const LoggerPlugin = require('haste-plugin-wix-logger');
const globs = require('../globs');
const {inTeamCity} = require('../utils');

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {read, mocha, protractor} = tasks;

  await run(
    read({pattern: globs.specs()}),
    mocha({
      requireFiles: [require.resolve('../../config/test-setup')],
      timeout: 30000,
      reporter: inTeamCity() ? 'mocha-env-reporter' : 'progress',
    })
  );

  await run(
    protractor({
      webdriverManagerArgs: ['--standalone', '--versions.chrome', '2.29', '--gecko', 'false'],
      configPath: require.resolve('../../config/protractor.conf.js')
    })
  );
};

