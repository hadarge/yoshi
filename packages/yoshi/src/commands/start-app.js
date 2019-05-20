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

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const openBrowser = require('react-dev-utils/openBrowser');
const chokidar = require('chokidar');
const project = require('yoshi-config');
const {
  BUILD_DIR,
  PUBLIC_DIR,
  ASSETS_DIR,
  TARGET_DIR,
} = require('yoshi-config/paths');
const { PORT } = require('../constants');
const {
  createClientWebpackConfig,
  createServerWebpackConfig,
} = require('../../config/webpack.config');
const {
  createCompiler,
  createDevServer,
  waitForCompilation,
} = require('../webpack-utils');
const Server = require('../server-process');

const host = '0.0.0.0';

const https = cliArgs.https || project.servers.cdn.ssl;

function watchPublicFolder() {
  const watcher = chokidar.watch(PUBLIC_DIR, {
    persistent: true,
    ignoreInitial: false,
    cwd: PUBLIC_DIR,
  });

  const copyFile = relativePath => {
    return fs.copy(
      path.join(PUBLIC_DIR, relativePath),
      path.join(ASSETS_DIR, relativePath),
    );
  };

  const removeFile = relativePath => {
    return fs.remove(path.join(ASSETS_DIR, relativePath));
  };

  watcher.on('change', copyFile);
  watcher.on('add', copyFile);
  watcher.on('unlink', removeFile);
}

module.exports = async () => {
  // Clean tmp folders
  await Promise.all([fs.emptyDir(BUILD_DIR), fs.emptyDir(TARGET_DIR)]);

  // Copy public to statics dir
  if (await fs.pathExists(PUBLIC_DIR)) {
    // all files in `PUBLIC_DIR` are copied initially as Chokidar's `ignoreInitial`
    // option is set to false
    watchPublicFolder();
  }

  const clientConfig = createClientWebpackConfig({
    isDebug: true,
    isAnalyze: false,
    isHmr: project.hmr,
  });

  const serverConfig = createServerWebpackConfig({
    isDebug: true,
    isHmr: true,
  });

  // Configure compilation
  const multiCompiler = createCompiler([clientConfig, serverConfig], { https });
  const compilationPromise = waitForCompilation(multiCompiler);

  const [clientCompiler, serverCompiler] = multiCompiler.compilers;

  // Start up server process
  const serverProcess = new Server({ serverFilePath: cliArgs.server });

  // Start up webpack dev server
  const devServer = await createDevServer(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    port: project.servers.cdn.port,
    https,
    host,
  });

  serverCompiler.watch({ 'info-verbosity': 'none' }, async (error, stats) => {
    // We save the result of this build to webpack-dev-server's internal state so the last
    // server build results are sent to the browser on every refresh
    //
    // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L144
    devServer._stats = stats;

    const jsonStats = stats.toJson();

    // If the spawned server process has died, restart it
    if (serverProcess.child && serverProcess.child.exitCode !== null) {
      await serverProcess.restart();

      // Send the browser an instruction to refresh
      await devServer.send('hash', jsonStats.hash);
      await devServer.send('ok');
    }
    // If it's alive, send it a message to trigger HMR
    else {
      // If there are no errors and the server can be refreshed
      // then send it a signal and wait for a responsne
      if (serverProcess.child && !error && !stats.hasErrors()) {
        const { success } = await serverProcess.send({});

        // HMR wasn't successful, restart the server process
        if (!success) {
          await serverProcess.restart();
        }

        // Send the browser an instruction to refresh
        await devServer.send('hash', jsonStats.hash);
        await devServer.send('ok');
      } else {
        // If there are errors, show them on the browser
        if (jsonStats.errors.length > 0) {
          await devServer.send('errors', jsonStats.errors);
        } else if (jsonStats.warnings.length > 0) {
          await devServer.send('warnings', jsonStats.warnings);
        }
      }
    }
  });

  console.log(chalk.cyan('Starting development environment...\n'));

  // Start up webpack dev server
  await new Promise((resolve, reject) => {
    devServer.listen(project.servers.cdn.port, host, err =>
      err ? reject(err) : resolve(devServer),
    );
  });

  // Wait for both compilations to finish
  try {
    await compilationPromise;
  } catch (error) {
    // We already log compilation errors in a compiler hook
    // If there's an error, just exit(1)
    process.exit(1);
  }

  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
      serverProcess.end();
      devServer.close();
      process.exit();
    });
  });

  try {
    await serverProcess.initialize();
  } catch (error) {
    console.log();
    console.log(
      chalk.red(`Couldn't find a server running on port ${chalk.bold(PORT)}`),
    );
    console.log(
      chalk.red(
        `Please check that ${chalk.bold(
          cliArgs.server,
        )} starts up correctly and that it listens on the expected port`,
      ),
    );
    console.log();
    console.log(chalk.red('Aborting'));
    process.exit(1);
  }

  // Once it started, open up the browser
  openBrowser(cliArgs.url || `http://localhost:${PORT}`);

  return {
    persistent: true,
  };
};
