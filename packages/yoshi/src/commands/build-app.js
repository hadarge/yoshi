process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2));

const rootApp = require('yoshi-config/root-app');
const buildApps = require('./utils/build-apps');
const {
  printBundleSizeSuggestion,
  printBuildResult,
} = require('./utils/print-build-results');

module.exports = async () => {
  const { getAppData } = await buildApps([rootApp], cliArgs);

  const [, clientOptimizedStats, serverStats] = getAppData(rootApp).stats;

  printBuildResult({ webpackStats: [clientOptimizedStats, serverStats] });
  printBundleSizeSuggestion();

  return {
    persistent: !!cliArgs.analyze,
  };
};
