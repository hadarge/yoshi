const fs = require('fs-extra');
const chalk = require('chalk');
const stream = require('stream');
const waitPort = require('wait-port');
const child_process = require('child_process');
const { NODE_PLATFORM_DEFAULT_CONFIGS_DIR } = require('yoshi-config/paths');
const { PORT } = require('./constants');

function serverLogPrefixer() {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chalk.greenBright('[SERVER]')}: ${chunk.toString()}`);
      callback();
    },
  });
}

const inspectArg = process.argv.find(arg => arg.includes('--debug'));

module.exports = class Server {
  constructor({ serverFilePath }) {
    this.serverFilePath = serverFilePath;
  }

  async initialize() {
    this.child = child_process.fork(this.serverFilePath, {
      stdio: 'pipe',
      execArgv: [inspectArg]
        .filter(Boolean)
        .map(arg => arg.replace('debug', 'inspect')),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT,

        // Check if the project has the default directory for loading node platform
        // configs
        //
        // If it exists, the project is not using the `index-dev.js` pattern and we
        // keep the defaults
        //
        // Otherwise, we inject our own defaults to keep boilerplate to a minimum
        //
        // https://github.com/wix/yoshi/pull/1153
        ...(fs.existsSync(NODE_PLATFORM_DEFAULT_CONFIGS_DIR)
          ? {}
          : {
              MANAGEMENT_PORT: Number(PORT) + 1,
              APP_CONF_DIR: './target/dev/configs',
              APP_LOG_DIR: './target/dev/logs',
              APP_PERSISTENT_DIR: './target/dev/persistent',
              APP_TEMPL_DIR: './templates',
              NEW_RELIC_LOG_LEVEL: 'warn',
            }),
      },
    });

    this.child.stdout.pipe(serverLogPrefixer()).pipe(process.stdout);
    this.child.stderr.pipe(serverLogPrefixer()).pipe(process.stderr);

    this.child.on('message', this.onMessage.bind(this));

    await waitPort({
      port: PORT,
      output: 'silent',
      timeout: 20000,
    });
  }

  onMessage(response) {
    this._resolve(response);
  }

  end() {
    this.child.kill();
  }

  send(message) {
    this.child.send(message);

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  async restart() {
    if (this.child.exitCode === null) {
      this.child.kill();

      await new Promise(resolve =>
        setInterval(() => {
          if (this.child.killed) {
            resolve();
          }
        }, 100),
      );
    }

    await this.initialize();
  }
};
