const path = require('path');
const cors = require('cors');
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const globby = require('globby');
const clearConsole = require('react-dev-utils/clearConsole');
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const rootApp = require('yoshi-config/root-app');
const { PORT } = require('./constants');
const { redirectMiddleware } = require('../src/tasks/cdn/server-api');
const WebpackDevServer = require('webpack-dev-server');
const Watchpack = require('watchpack');
const { shouldDeployToCDN, inTeamCity } = require('yoshi-helpers/queries');
const { getProjectCDNBasePath } = require('yoshi-helpers/utils');

const isDevelopment = process.env.NODE_ENV === 'development';

const isInteractive = process.stdout.isTTY;
const possibleServerEntries = ['./server', '../dev/server'];

function createCompiler(app, config, { https }) {
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
          app.servers.cdn.port,
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

function addEntry(entry, hotEntries) {
  let newEntry = {};

  if (typeof entry === 'function') {
    const originalEntry = entry;

    newEntry = async () => {
      return addEntry(await originalEntry(), hotEntries);
    };
  } else if (!Array.isArray(entry) && typeof entry === 'object') {
    const keys = Object.keys(entry);

    for (const entryName of keys) {
      newEntry[entryName] = hotEntries.concat(entry[entryName]);
    }
  } else {
    newEntry = hotEntries.concat(entry);
  }

  return newEntry;
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

function createDevServer(
  clientCompiler,
  { publicPath, https, host, app = rootApp },
) {
  const devServer = new WebpackDevServer(clientCompiler, {
    // Enable gzip compression for everything served
    compress: true,
    clientLogLevel: 'error',
    contentBase: app.STATICS_DIR,
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
    allowedHosts: [
      '.wix.com',
      '.wixsite.com',
      '.ooidev.com',
      '.deviantart.lan',
    ],
    before(expressApp) {
      // Send cross origin headers
      expressApp.use(cors());
      // Redirect `.min.(js|css)` to `.(js|css)`
      expressApp.use(redirectMiddleware(host, app.servers.cdn.port));
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

function createServerEntries(context, app) {
  const serverFunctions = fs.pathExistsSync(app.SRC_DIR)
    ? globby.sync('**/*.api.(js|ts)', { cwd: app.SRC_DIR, absolute: true })
    : [];

  const serverRoutes = fs.pathExistsSync(app.ROUTES_DIR)
    ? globby.sync('**/*.(js|ts)', { cwd: app.ROUTES_DIR, absolute: true })
    : [];

  // Normalize to an object with short entry names
  const entries = [...serverFunctions, ...serverRoutes].reduce(
    (acc, filepath) => {
      return {
        ...acc,
        [path.relative(context, filepath).replace(/\.[^/.]+$/, '')]: filepath,
      };
    },
    {},
  );

  // Add custom entries for `yoshi-server`
  entries['routes/_api_'] = 'yoshi-server/build/routes/api';

  return entries;
}

function watchDynamicEntries(watching, app) {
  const wp = new Watchpack();

  wp.on('aggregated', () => {
    watching.invalidate();
  });

  wp.watch([], [app.SRC_DIR, app.ROUTES_DIR]);
}

const exists = (app, extensions) => entry => {
  return (
    globby.sync(`${entry}(${extensions.join('|')})`, {
      cwd: app.SRC_DIR,
    }).length > 0
  );
};

function validateServerEntry(app, extensions) {
  const serverEntry = possibleServerEntries.find(exists(app, extensions));

  if (!serverEntry && !app.yoshiServer) {
    throw new Error(
      `We couldn't find your server entry. Please use one of the defaults:
          - "src/server": for a fullstack project
          - "dev/server": for a client only project`,
    );
  }
  return serverEntry;
}

function calculatePublicPath(app) {
  // default public path
  let publicPath = '/';

  if (!inTeamCity() || isDevelopment) {
    // When on local machine or on dev environment,
    // set the local dev-server url as the public path
    publicPath = app.servers.cdn.url;
  }

  // In case we are running in CI and there is a pom.xml file, change the public path according to the path on the cdn
  // The path is created using artifactName from pom.xml and artifact version from an environment param.
  if (shouldDeployToCDN(rootApp)) {
    publicPath = getProjectCDNBasePath();
  }

  return publicPath;
}

module.exports = {
  createDevServer,
  createCompiler,
  waitForCompilation,
  addEntry,
  overrideRules,
  createServerEntries,
  watchDynamicEntries,
  validateServerEntry,
  calculatePublicPath,
};
