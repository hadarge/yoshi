const path = require('path');
const LoggerPlugin = require('haste-plugin-wix-logger');
const globs = require('../globs');
const {inTeamCity, watchMode} = require('../utils');
const shouldWatch = watchMode();

module.exports = async configure => {
  const {run, tasks, watch} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
    persistent: shouldWatch,
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

  if (shouldWatch) {
    watch([globs.specs(), path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], () => run(
      read({pattern: globs.specs()}),
      mocha({
        requireFiles: [require.resolve('../../config/test-setup')],
        timeout: 30000,
        reporter: inTeamCity() ? 'mocha-env-reporter' : 'progress',
      }),
    ));
  }

  if (!shouldWatch) {
    await run(
      protractor({
        webdriverManagerArgs: ['--standalone', '--versions.chrome', '2.29', '--gecko', 'false'],
        configPath: require.resolve('../../config/protractor.conf.js')
      })
    );
  }
};

