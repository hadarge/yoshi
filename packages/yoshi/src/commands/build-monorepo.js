process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2));

const chalk = require('chalk');
const loadPackages = require('yoshi-config/load-packages');
const {
  printBundleSizeSuggestion,
  printBuildResult,
} = require('./utils/print-build-results');
const buildApps = require('./utils/build-apps');
const buildLibs = require('./utils/build-libs');
const { verifyTypeScriptReferences } = require('./utils/index');

module.exports = async () => {
  await verifyTypeScriptReferences();

  const { apps, libs } = await loadPackages();

  console.log(chalk.bold.cyan('Building packages...'));
  console.log();

  await buildLibs(libs);

  console.log(chalk.bold.cyan('Building bundle...'));
  console.log();

  // Build all apps;
  const { getAppData } = await buildApps(apps, cliArgs);

  // Print a nice output
  apps.forEach(app => {
    console.log(chalk.bold.underline(app.name));
    console.log();

    const [, clientOptimizedStats, serverStats] = getAppData(app).stats;

    printBuildResult({
      app,
      webpackStats: [clientOptimizedStats, serverStats],
    });

    console.log();
  });

  printBundleSizeSuggestion();

  return {
    persistent: false,
  };
};
