const wnpm = require('wnpm-ci');
const { createRunner } = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2));

const shouldBumpMinor = cliArgs.minor;

const runner = createRunner({
  logger: new LoggerPlugin(),
});

module.exports = runner.command(async () =>
  wnpm.prepareForRelease({ shouldBumpMinor }),
);
