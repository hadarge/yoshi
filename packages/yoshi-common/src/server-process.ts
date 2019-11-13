import path from 'path';
import stream from 'stream';
import child_process from 'child_process';
import chalk from 'chalk';
import waitPort from 'wait-port';
import fs from 'fs-extra';
import { getDevelopmentEnvVars } from 'yoshi-helpers/bootstrap-utils';
import { SERVER_LOG_FILE } from 'yoshi-config/paths';
import SocketServer from './socket-server';
import { PORT } from './utils/constants';

function serverLogPrefixer() {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chalk.greenBright('[SERVER]')}: ${chunk.toString()}`);
      callback();
    },
  });
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

const inspectArg = process.argv.find(arg => arg.includes('--debug'));

export default class ServerProcess {
  private cwd: string;
  private serverFilePath: string;
  public socketServer: SocketServer;
  public child?: child_process.ChildProcess;
  private resolve?: (value?: unknown) => void;

  constructor({
    cwd,
    serverFilePath,
    socketServer,
  }: {
    cwd: string;
    serverFilePath: string;
    socketServer: SocketServer;
  }) {
    this.cwd = cwd;
    this.socketServer = socketServer;
    this.serverFilePath = serverFilePath;
  }

  async initialize() {
    await this.socketServer.initialize();

    const bootstrapEnvironmentParams = getDevelopmentEnvVars({
      port: PORT,
    });

    this.child = child_process.fork(this.serverFilePath, [], {
      stdio: 'pipe',
      execArgv: [inspectArg]
        .filter(notUndefined)
        .map(arg => arg.replace('debug', 'inspect')),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT: `${PORT}`,
        HMR_PORT: `${this.socketServer.hmrPort}`,
        ...bootstrapEnvironmentParams,
      },
    });

    const serverLogWriteStream = fs.createWriteStream(
      path.join(this.cwd, SERVER_LOG_FILE),
    );
    const serverOutLogStream = this.child.stdout!.pipe(serverLogPrefixer());
    serverOutLogStream.pipe(serverLogWriteStream);
    serverOutLogStream.pipe(process.stdout);

    const serverErrorLogStream = this.child.stderr!.pipe(serverLogPrefixer());
    serverErrorLogStream.pipe(serverLogWriteStream);
    serverErrorLogStream.pipe(process.stderr);

    this.socketServer.on('message', this.onMessage.bind(this));

    await waitPort({
      port: PORT,
      output: 'silent',
      timeout: 20000,
    });
  }

  onMessage(response: any) {
    this.resolve && this.resolve(response);
  }

  end() {
    this.child && this.child.kill();
  }

  send(message: any) {
    this.socketServer.send(message);

    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  async restart() {
    // @ts-ignore
    if (this.child && this.child.exitCode === null) {
      this.child.kill();

      await new Promise(resolve =>
        setInterval(() => {
          if (this.child && this.child.killed) {
            resolve();
          }
        }, 100),
      );
    }

    await this.initialize();
  }

  static async create({
    cwd = process.cwd(),
    serverFilePath,
  }: {
    cwd?: string;
    serverFilePath: string;
  }) {
    const socketServer = await SocketServer.create();

    return new ServerProcess({ socketServer, cwd, serverFilePath });
  }
}
