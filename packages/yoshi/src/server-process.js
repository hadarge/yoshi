const chalk = require('chalk');
const stream = require('stream');
const waitPort = require('wait-port');
const child_process = require('child_process');
const fs = require('fs-extra');
const SocketServer = require('./socket-server');
const { PORT } = require('./constants');
const { getDevelopmentEnvVars } = require('yoshi-helpers/bootstrap-utils');
const { SERVER_LOG_FILE } = require('yoshi-config/paths');

const bootstrapEnvironmentParams = getDevelopmentEnvVars({
  port: PORT,
});

function serverLogPrefixer() {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chalk.greenBright('[SERVER]')}: ${chunk.toString()}`);
      callback();
    },
  });
}

const inspectArg = process.argv.find(arg => arg.includes('--debug'));

module.exports = class ServerProcess {
  constructor({ serverFilePath, hmrPort }) {
    this.hmrPort = hmrPort;
    this.socketServer = new SocketServer({ hmrPort });
    this.serverFilePath = serverFilePath;
  }

  async initialize() {
    await this.socketServer.initialize();

    this.child = child_process.fork(this.serverFilePath, {
      stdio: 'pipe',
      execArgv: [inspectArg]
        .filter(Boolean)
        .map(arg => arg.replace('debug', 'inspect')),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT,
        HMR_PORT: this.hmrPort,
        ...bootstrapEnvironmentParams,
      },
    });

    const serverLogWriteStream = fs.createWriteStream(SERVER_LOG_FILE);
    const serverOutLogStream = this.child.stdout.pipe(serverLogPrefixer());
    serverOutLogStream.pipe(serverLogWriteStream);
    serverOutLogStream.pipe(process.stdout);

    const serverErrorLogStream = this.child.stderr.pipe(serverLogPrefixer());
    serverErrorLogStream.pipe(serverLogWriteStream);
    serverErrorLogStream.pipe(process.stderr);

    this.socketServer.on('message', this.onMessage.bind(this));

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
    this.socketServer.send(message);

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
