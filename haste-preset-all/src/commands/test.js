const LoggerPlugin = require('haste-plugin-wix-logger');
const {specs: testsGlob} = require('../globs');

module.exports = async configure => {
  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {read, mocha, protractor} = tasks;

  await run(
    read({pattern: testsGlob()}),
    mocha({
      requireFiles: [require.resolve('../../config/test-setup')],
      timeout: 30000,
    })
  );

  await run(
    protractor({
      webdriverManagerArgs: ['--standalone', '--versions.chrome', '2.29', '--gecko', 'false'],
      configPath: require.resolve('../../config/protractor.conf.js')
    })
  );
};

