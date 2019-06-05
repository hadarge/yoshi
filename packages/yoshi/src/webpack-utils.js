const cors = require('cors');
const chalk = require('chalk');
const webpack = require('webpack');
const clearConsole = require('react-dev-utils/clearConsole');
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const project = require('yoshi-config');
const { STATICS_DIR } = require('yoshi-config/paths');
const { PORT } = require('./constants');
const { redirectMiddleware } = require('../src/tasks/cdn/server-api');
const WebpackDevServer = require('webpack-dev-server');

const isInteractive = process.stdout.isTTY;

function createCompiler(config, { https }) {
  let compiler;

  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  compiler.hooks.invalid.tap('recompile-log', () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  compiler.hooks.done.tap('finished-log', stats => {
    if (isInteractive) {
      clearConsole();
    }

    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));

      if (isInteractive) {
        const serverUrls = prepareUrls('http', '0.0.0.0', PORT);
        const devServerUrls = prepareUrls(
          https ? 'https' : 'http',
          '0.0.0.0',
          project.servers.cdn.port,
        );

        console.log();
        console.log(
          `Your server is starting and should be accessible from your browser.`,
        );
        console.log();

        console.log(
          `  ${chalk.bold('Local:')}            ${
            serverUrls.localUrlForTerminal
          }`,
        );
        console.log(
          `  ${chalk.bold('On Your Network:')}  ${
            serverUrls.lanUrlForTerminal
          }`,
        );

        console.log();
        console.log(
          `Your bundles and other static assets are served from your ${chalk.bold(
            'dev-server',
          )}.`,
        );
        console.log();

        console.log(
          `  ${chalk.bold('Local:')}            ${
            devServerUrls.localUrlForTerminal
          }`,
        );
        console.log(
          `  ${chalk.bold('On Your Network:')}  ${
            devServerUrls.lanUrlForTerminal
          }`,
        );

        console.log();
        console.log('Note that the development build is not optimized.');
        console.log(
          `To create a production build, use ` +
            `${chalk.cyan('npm run build')}.`,
        );
        console.log();
      }
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }

      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));

      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n'));
    }
  });

  return compiler;
}

function addEntry(config, hotEntries) {
  let newEntry = {};

  if (!Array.isArray(config.entry) && typeof config.entry === 'object') {
    const keys = Object.keys(config.entry);

    for (const entryName of keys) {
      newEntry[entryName] = hotEntries.concat(config.entry[entryName]);
    }
  } else {
    newEntry = hotEntries.concat(config.entry);
  }

  config.entry = newEntry;
}

function overrideRules(rules, patch) {
  return rules.map(ruleToPatch => {
    let rule = patch(ruleToPatch);
    if (rule.rules) {
      rule = { ...rule, rules: overrideRules(rule.rules, patch) };
    }
    if (rule.oneOf) {
      rule = { ...rule, oneOf: overrideRules(rule.oneOf, patch) };
    }
    if (rule.use) {
      rule = { ...rule, use: overrideRules(rule.use, patch) };
    }
    return rule;
  });
}

function createDevServer(clientCompiler, { publicPath, https, host }) {
  const devServer = new WebpackDevServer(clientCompiler, {
    // Enable gzip compression for everything served
    compress: true,
    clientLogLevel: 'error',
    contentBase: STATICS_DIR,
    watchContentBase: true,
    hot: true,
    publicPath,
    // We write our own errors/warnings to the console
    quiet: true,
    https,
    // The server should be accessible externally
    host,
    overlay: true,
    // https://github.com/wix/yoshi/pull/1191
    allowedHosts: ['.wix.com', '.wixsite.com'],
    before(app) {
      // Send cross origin headers
      app.use(cors());
      // Redirect `.min.(js|css)` to `.(js|css)`
      app.use(redirectMiddleware(host, project.servers.cdn.port));
    },
  });

  // Update sockets with new stats, we use the sockWrite() method
  // to update the hot client with server data
  devServer.send = (...args) => {
    return devServer.sockWrite(devServer.sockets, ...args);
  };

  return devServer;
}

function waitForCompilation(compiler) {
  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap('promise', stats =>
      stats.hasErrors() ? reject(stats) : resolve(stats),
    );
  });
}

module.exports = {
  createDevServer,
  createCompiler,
  waitForCompilation,
  addEntry,
  overrideRules,
};
