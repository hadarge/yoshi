#!/usr/bin/env node
const prog = require('commander');
const runCLI = require('../src/cli');
const { version } = require('../package');

const infoCommand = require('../src/commands/info');

// IDEs start debugging with '--inspect' or '--inspect-brk' option. We are setting --debug instead
require('./normalize-debugging-args')();

prog.version(version).description('A toolkit for building applications in Wix');

prog
  .command('lint [files...]')
  .description('Run the linter')
  .option('--fix', 'Automatically fix lint problems')
  .option('--format', 'Use a specific formatter for eslint/tslint')
  .action(() => runCLI('lint'));

prog
  .command('test')
  .description('Run unit tests and e2e tests if exists')
  .option('--mocha', 'Run unit tests with Mocha')
  .option('--jasmine', 'Run unit tests with Jasmine')
  .option('--karma', 'Run unit tests with Karma')
  .option('--jest', 'Run tests with Jest')
  .option('--protractor', 'Run e2e tests with Protractor')
  .option('--debug', 'Allow test debugging')
  .option('--coverage', 'Collect and output code coverage')
  .option('--runInBand', 'Run all tests serially in the current process')
  .option('--forceExit', 'Force Jest to exit after all tests completed')
  .option(
    '--debug-brk',
    "Allow test debugging, process won't start until debugger will be attached",
  )
  .option(
    '-w, --watch',
    'Run tests on watch mode (mocha, jasmine, jest, karma)',
  )
  .action(() => runCLI('test'));

prog
  .command('build')
  .description('Build the app for production')
  .option('--output', 'The output directory for static assets')
  .option('--analyze', 'Run webpack-bundle-analyzer plugin')
  .option('--no-min', 'Do not output minified bundle')
  .action(() => runCLI('build'));

prog
  .command('start')
  .description('Run the app in development mode (also spawns npm test)')
  .option('-e, --entry-point', 'Entry point for the app')
  .option(
    '--manual-restart',
    'Get SIGHUP on change and manage application reboot manually',
  )
  .option('--no-test', 'Do not spawn npm test after start')
  .option('--no-server', 'Do not spawn the app server')
  .option('--debug', 'Allow app-server debugging')
  .option('--production', 'start using unminified production build')
  .option(
    '--debug-brk',
    "Allow app-server debugging, process won't start until debugger will be attached",
  )
  .option('--ssl', 'Serve the app bundle on https')
  .action(() => runCLI('start'));

prog
  .command('release')
  .description(
    'use wnpm-ci to bump a patch version if needed, should be used by CI',
  )
  .option('--minor', 'bump a minor version instead of a patch')
  .action(() => runCLI('release'));

prog
  .command('info')
  .description('Get your local environment information')
  .action(infoCommand);

prog.parse(process.argv);

process.on('unhandledRejection', error => {
  throw error;
});
