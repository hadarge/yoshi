process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2), {
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
const stream = require('stream');
const child_process = require('child_process');
const chalk = require('chalk');
const webpack = require('webpack');
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
  waitForServerToStart,
  waitForCompilation,
} = require('../webpack-utils');

function serverLogPrefixer() {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chalk.greenBright('[SERVER]')}: ${chunk.toString()}`);
      callback();
    },
  });
}

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
  if (await fs.exists(PUBLIC_DIR)) {
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

  // Start up server compilation
  let serverProcess;

  serverCompiler.watch({ 'info-verbosity': 'none' }, (error, stats) => {
    if (serverProcess && !error && !stats.hasErrors()) {
      // If all is good, send our hot client entry a message to trigger HMR
      serverProcess.send({});
    }
  });

  console.log(chalk.cyan('Starting development environment...\n'));

  const host = '0.0.0.0';

  // Start up webpack dev server
  const devServer = await createDevServer(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    port: project.servers.cdn.port,
    host,
  });

  // Start up webpack dev server
  await new Promise((resolve, reject) => {
    devServer.listen(
      project.servers.cdn.port,
      host,
      err => (err ? reject(err) : resolve(devServer)),
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

  // Start up the user's server
  const inspectArg = process.argv.find(arg => arg.includes('--debug'));

  const startServerProcess = () => {
    serverProcess = child_process.fork(cliArgs.server, {
      stdio: 'pipe',
      execArgv: [inspectArg]
        .filter(Boolean)
        .map(arg => arg.replace('debug', 'inspect')),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT,
      },
    });

    serverProcess.stdout.pipe(serverLogPrefixer()).pipe(process.stdout);
    serverProcess.stderr.pipe(serverLogPrefixer()).pipe(process.stderr);

    serverProcess.on('message', () => {
      serverProcess.kill();
      startServerProcess();
    });
  };

  startServerProcess();

  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
      serverProcess.kill();
      devServer.close();
      process.exit();
    });
  });

  await waitForServerToStart({ server: cliArgs.server });

  // Once it started, open up the browser
  openBrowser(`http://localhost:${PORT}`);

  return {
    persistent: true,
  };
};
