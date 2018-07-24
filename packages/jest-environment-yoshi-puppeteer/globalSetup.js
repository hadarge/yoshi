process.on('exit', () => {
  if (global.SERVER) {
    global.SERVER.kill();
  }
});

const fs = require('fs-extra');
const stream = require('stream');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const child_process = require('child_process');
const waitPort = require('wait-port');
const { WS_ENDPOINT_PATH } = require('./constants');
const { getProcessForPort, loadConfig } = require('./utils');
const { servers } = require('yoshi/config/project');

const serverLogPrefixer = () => {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chalk.magentaBright('[SERVER]')}: ${chunk.toString()}`);
      callback();
    },
  });
};

const config = loadConfig();

module.exports = async () => {
  // start with a few new lines
  console.log('\n\n');

  global.BROWSER = await puppeteer.launch({
    // defaults
    headless: true,
    args: ['--no-sandbox'],

    // user defined options
    ...config.puppeteer,
  });

  const webpackDevServerProcessCwd = getProcessForPort(servers.cdn.port());

  if (!webpackDevServerProcessCwd) {
    throw new Error(
      `Could not find webpack dev server running on port ${servers.cdn.port()}, please run 'npm start'.`,
    );
  }

  if (webpackDevServerProcessCwd.directory !== process.cwd()) {
    throw new Error(
      `A different process (${
        webpackDevServerProcessCwd.directory
      }) is already running on port '${servers.cdn.port()}', aborting.`,
    );
  }

  if (config.server) {
    const serverProcessCwd = getProcessForPort(config.server.port);

    if (serverProcessCwd) {
      throw new Error(
        `A different process (${
          serverProcessCwd.directory
        }) is already running on port ${config.server.port}, aborting.`,
      );
    }

    global.SERVER = child_process.spawn('node', [config.server.filename], {
      stdio: 'pipe',
      env: {
        ...process.env,
        PORT: config.server.port,
      },
    });

    global.SERVER.stdout.pipe(serverLogPrefixer()).pipe(process.stdout);
    global.SERVER.stderr.pipe(serverLogPrefixer()).pipe(process.stderr);

    if (config.server.port) {
      const timeout = 5000;

      const portFound = await waitPort({
        port: config.server.port,
        output: 'silent',
        timeout,
      });

      if (!portFound) {
        throw new Error(
          `Tried running '${
            config.server.filename
          }' but couldn't find a server on port '${
            config.server.port
          }' after ${timeout} miliseconds.`,
        );
      }
    }

    console.log('\n');
  }

  await fs.outputFile(WS_ENDPOINT_PATH, global.BROWSER.wsEndpoint());
};
