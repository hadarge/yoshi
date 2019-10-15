process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2), {
  alias: {
    server: 'entry-point',
    https: 'ssl',
  },
  default: {
    server: 'index.js',
    https: false,
  },
});

if (cliArgs.production) {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
}

const chalk = require('chalk');
const { apps } = require('yoshi-config/packages');
const startSingleApp = require('./utils/start-single-app');
const { verifyTypeScriptReferences } = require('./utils/index');

const [, appName] = cliArgs._;

module.exports = async () => {
  await verifyTypeScriptReferences();

  let app;

  // Find a specific app if a name was passed
  if (appName) {
    app = apps.find(lernaApp => lernaApp.name === appName);
  }
  // If there's only one app, start that
  else if (apps.length === 1) {
    app = apps[0];
  }
  // Otherwise, fail with an error
  else {
    console.log();
    console.log(chalk.red(`Couldn't find an app to start`));
    console.log(
      chalk.red(
        `Please choose which app to start by running \`npx yoshi start <appName>\``,
      ),
    );
    console.log();
    console.log(chalk.red('Aborting'));
    process.exit(1);
  }

  await startSingleApp(app, cliArgs);

  return {
    persistent: true,
  };
};
