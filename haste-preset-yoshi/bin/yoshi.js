#!/usr/bin/env node
const childProcess = require('child_process');
const hasteToYoshi = require('haste-to-yoshi');
const prog = require('caporal');
const boxen = require('boxen');
const chalk = require('chalk');
const runCLI = require('../src/cli');
const {version} = require('../package');
const {BOOL} = prog;
const isCI = process.env.CONTINUOUS_INTEGRATION ||
  process.env.BUILD_NUMBER ||
  process.env.TEAMCITY_VERSION;

if (!isCI) {
  if (process.argv.slice(2).includes('migrate')) {
    const gitStatus = childProcess.execSync('git status --porcelain').toString();

    if (gitStatus.trim() !== '') {
      console.log(chalk.red('Please commit your changes before running the migration script'));
      console.log();
      console.log(gitStatus);
      console.log();
      process.exit(1);
    }

    const results = hasteToYoshi();

    if (results.length === 0) {
      console.log(chalk.cyan('You are already migrated 🦌  No changes has been made 🐢'));
    } else {
      console.log(chalk.green('migration success 🎉'));
      console.log();
      console.log(chalk.underline('migrated files: '));

      results.forEach(file => {
        console.log(chalk.cyan(file));
      });
    }

    process.exit(0);
  }

  const message = `${chalk.red('ACTION REQUIRED 🔱')}

We are going back to ${chalk.bold('yoshi')} 🦎
${chalk.white('Same code, different name')}

Want to know why❓ Read this: ${chalk.cyan('https://github.com/wix-private/fed-handbook/wiki/Yoshi-is-not-dead')}

To migrate, run the following commands in your terminal:

${chalk.bold(' npx yoshi migrate')}
${chalk.bold(' rm -rf node_modules package-lock.json yarn.lock')}
${chalk.bold(' npm install')}

Commit and push your changes

For more information - ${chalk.cyan('https://github.com/wix-private/haste-to-yoshi')}
Let us know if anything goes wrong on ${chalk.bold('#fed-infra')}
`;

  console.log(boxen(message, {padding: 1, borderStyle: 'round'}));
  process.exit(1);
}

prog
  .version(version)
  .description('haste-preset-yoshi');

prog.command('lint', 'Run the linter')
  .option('--fix', 'Automatically fix lint problems')
  .option('--format', 'Use a specific formatter for eslint/tslint')
  .action(() => runCLI('lint'));

prog.command('test', 'Run unit tests and e2e tests if exists')
  .option('--mocha', 'Run unit tests with Mocha', BOOL)
  .option('--jasmine', 'Run unit tests with Jasmine', BOOL)
  .option('--karma', 'Run unit tests with Karma', BOOL)
  .option('--jest', 'Run tests with Jest', BOOL)
  .option('--protractor', 'Run e2e tests with Protractor', BOOL)
  .option('-w, --watch', 'Run tests on watch mode (mocha, jasmine, jest, karma)', BOOL)
  .action(() => runCLI('test'));

prog.command('build', 'Build the app for production')
  .option('--output', 'The output directory for static assets', /\w+/, 'statics')
  .option('--analyze', 'Run webpack-bundle-analyzer plugin', BOOL)
  .action(() => runCLI('build'));

prog.command('start', 'Run the app in development mode (also spawns npm test)')
  .option('-e, --entry-point', 'Entry point for the app', /\w+/, './dist/index.js')
  .option('--manual-restart', 'Get SIGHUP on change and manage application reboot manually', BOOL, 'false')
  .option('--no-test', 'Do not spawn npm test after start', BOOL, 'false')
  .option('--no-server', 'Do not spawn the app server', BOOL, 'false')
  .action(() => runCLI('start'));

prog.command('release', 'publish the package, should be used by CI')
  .action(() => runCLI('release'));

prog.parse(process.argv);

process.on('unhandledRejection', error => {
  throw error;
});
