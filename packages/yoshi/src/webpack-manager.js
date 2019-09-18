const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const chalk = require('chalk');

module.exports = class WebpackManager {
  constructor() {
    this.apps = [];
  }

  addConfigs(app, configs) {
    this.apps.push({ appName: app.name, configs });
  }

  async runWebpack(configs) {
    try {
      const compiler = webpack(configs);

      const webpackStats = await new Promise((resolve, reject) => {
        compiler.run((err, stats) => (err ? reject(err) : resolve(stats)));
      });

      const messages = formatWebpackMessages(webpackStats.toJson({}, true));

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        throw new Error(messages.errors.join('\n\n'));
      }

      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(messages.warnings.join('\n\n'));
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      return webpackStats;
    } catch (error) {
      console.log(chalk.red('Failed to compile.\n'));
      console.error(error.message || error);

      process.exit(1);
    }
  }

  async run() {
    const webpackConfigs = this.apps.reduce((acc, app) => {
      return [...acc, ...app.configs];
    }, []);

    const webpackStats = await this.runWebpack(webpackConfigs);

    return {
      getAppData: app => {
        let appConfigStartIndex = 0;
        let appConfigEndIndex = 0;

        // Webpack's configs and stats are being spread in a flat list
        // This function iterate over each app and locate the configs and stats
        // that assosiate with the requested app
        for (let i = 0; i < this.apps.length; i++) {
          const { appName, configs } = this.apps[i];

          if (app.name === appName) {
            appConfigEndIndex = appConfigStartIndex + configs.length;
            break;
          }

          appConfigStartIndex += configs.length;
        }

        const stats = webpackStats.stats.slice(
          appConfigStartIndex,
          appConfigEndIndex,
        );

        const configs = webpackConfigs.slice(
          appConfigStartIndex,
          appConfigEndIndex,
        );

        return { configs, stats };
      },
    };
  }
};
