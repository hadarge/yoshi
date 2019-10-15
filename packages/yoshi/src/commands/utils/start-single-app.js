const fs = require('fs-extra');
const chalk = require('chalk');
const openBrowser = require('./open-browser');
const { isWebWorkerBundle } = require('yoshi-helpers/queries');
const { PORT } = require('../../constants');
const {
  createClientWebpackConfig,
  createServerWebpackConfig,
  createWebWorkerWebpackConfig,
} = require('../../../config/webpack.config');
const {
  createCompiler,
  createDevServer,
  waitForCompilation,
  watchDynamicEntries,
} = require('../../webpack-utils');
const ServerProcess = require('../../server-process');
const detect = require('detect-port');
const { watchPublicFolder } = require('./copy-assets');

const host = '0.0.0.0';

module.exports = async (app, options) => {
  console.log(chalk.cyan('Starting development environment...\n'));

  const https = options.https || app.servers.cdn.ssl;

  // Clean tmp folders
  await Promise.all([fs.emptyDir(app.BUILD_DIR), fs.emptyDir(app.TARGET_DIR)]);

  // Copy public to statics dir
  if (await fs.pathExists(app.PUBLIC_DIR)) {
    // all files in `PUBLIC_DIR` are copied initially as Chokidar's `ignoreInitial`
    // option is set to false
    watchPublicFolder();
  }

  // Generate an available port for server HMR
  const hmrPort = await detect();

  const clientConfig = createClientWebpackConfig({
    app,
    isDebug: true,
    isAnalyze: false,
    isHmr: app.hmr,
  });

  const serverConfig = createServerWebpackConfig({
    app,
    isDebug: true,
    isHmr: true,
    hmrPort,
  });

  let webWorkerConfig;

  if (isWebWorkerBundle) {
    webWorkerConfig = createWebWorkerWebpackConfig({
      isDebug: true,
      isHmr: true,
    });
  }

  // Configure compilation
  const multiCompiler = createCompiler(
    app,
    [clientConfig, serverConfig, webWorkerConfig].filter(Boolean),
    { https },
  );

  const compilationPromise = waitForCompilation(multiCompiler);

  const [
    clientCompiler,
    serverCompiler,
    webWorkerCompiler,
  ] = multiCompiler.compilers;

  // Start up server process
  const serverProcess = new ServerProcess({
    serverFilePath: options.server,
    hmrPort,
    app,
  });

  // Start up webpack dev server
  const devServer = await createDevServer(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    https,
    host,
    app,
  });

  if (isWebWorkerBundle) {
    webWorkerCompiler.watch(
      { 'info-verbosity': 'none' },
      async (error, stats) => {
        // We save the result of this build to webpack-dev-server's internal state so the last
        // worker build results are sent to the browser on every refresh.
        // It also affects the error overlay
        //
        // https://github.com/webpack/webpack-dev-server/blob/143762596682d8da4fdc73555880be05255734d7/lib/Server.js#L722
        devServer._stats = stats;

        const jsonStats = stats.toJson();

        if (!error && !stats.hasErrors()) {
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
      },
    );
  }

  const watching = serverCompiler.watch(
    { 'info-verbosity': 'none' },
    async (error, stats) => {
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
    },
  );

  // Re-run Webpack with new entries as they're added
  if (app.yoshiServer) {
    watchDynamicEntries(watching, app);
  }

  // Start up webpack dev server
  await new Promise((resolve, reject) => {
    devServer.listen(app.servers.cdn.port, host, err =>
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
          options.server,
        )} starts up correctly and that it listens on the expected port`,
      ),
    );
    console.log();
    console.log(chalk.red('Aborting'));
    process.exit(1);
  }

  openBrowser(options.url || app.startUrl || `http://localhost:${PORT}`);
};
