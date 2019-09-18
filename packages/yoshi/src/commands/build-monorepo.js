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

module.exports = async () => {
  const { apps, libs } = await loadPackages();

  // Build all libs
  await buildLibs(libs);

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
