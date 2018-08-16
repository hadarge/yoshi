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
const { servers } = require('yoshi/config/project');
const { loadConfig } = require('yoshi/src/utils');
const { WS_ENDPOINT_PATH } = require('./constants');
const { getProcessForPort, shouldRunE2Es } = require('./utils');

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
  // a bit hacky, run puppeteer setup only if it's required
  if (await shouldRunE2Es()) {
    // start with a few new lines
    console.log('\n\n');

    global.BROWSER = await puppeteer.launch({
      // defaults
      headless: true,
      args: ['--no-sandbox'],

      // user defined options
      ...config.puppeteer,
    });

    await fs.outputFile(WS_ENDPOINT_PATH, global.BROWSER.wsEndpoint());

    const webpackDevServerProcessCwd = getProcessForPort(servers.cdn.port());

    if (!webpackDevServerProcessCwd) {
      throw new Error(
        `Running E2E tests requires a server to serve static files. Could not find any dev server on port ${chalk.cyan(
          servers.cdn.port(),
        )}. Please run 'npm start' from a different terminal window.`,
      );
    }

    if (webpackDevServerProcessCwd.directory !== process.cwd()) {
      throw new Error(
        `A different process (${chalk.cyan(
          webpackDevServerProcessCwd.directory,
        )}) is already running on port '${chalk.cyan(
          servers.cdn.port(),
        )}', aborting.`,
      );
    }

    if (config.server) {
      const serverProcessCwd = getProcessForPort(config.server.port);

      if (serverProcessCwd) {
        throw new Error(
          `A different process (${chalk.cyan(
            serverProcessCwd.directory,
          )}) is already running on port ${chalk.cyan(
            config.server.port,
          )}, aborting.`,
        );
      }

      global.SERVER = child_process.spawn(config.server.command, {
        shell: true,
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
            `Tried running '${chalk.cyan(
              config.server.filename,
            )}' but couldn't find a server on port '${chalk.cyan(
              config.server.port,
            )}' after ${chalk.cyan(timeout)} miliseconds.`,
          );
        }
      }

      console.log('\n');
    }
  }
};
