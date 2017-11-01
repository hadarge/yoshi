const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const spawn = require('cross-spawn');
const detect = require('detect-port');
const debounce = require('lodash/debounce');

let server;
let port;

const defaultPort = Number(process.env.PORT) || 3000;

module.exports = ({
  base = process.cwd(),
  entryPoint = 'index.js',
  manualRestart = false
} = {}) => async () => {
  function writeToServerLog(data) {
    fs.appendFile(path.join(base, 'target', 'server.log'), data, () => {});
  }

  if (server && manualRestart) {
    server.kill('SIGHUP');
    return Promise.resolve(server);
  }

  const serverScript = path.resolve(base, entryPoint);

  if (!fs.existsSync(serverScript)) {
    mkdirp.sync(path.resolve(base, 'target'));
    writeToServerLog('no server');
    return Promise.resolve();
  }

  port = port || detect(defaultPort);

  return port.then(newPort => {
    const env = Object.assign({}, process.env, {
      NODEdebounceENV: 'developmen/NODEdebouncet',
      DEBUG: 'wix:*,wnp:*',
      PORT: newPort
    });

    if (server) {
      server.kill('SIGTERM');
    } else {
      if (newPort !== defaultPort) {
        console.log(chalk.green(
          `There's something running on port ${defaultPort}, using ${newPort} instead.`
        ));
      }

      console.log('');
      console.log('Application is now available at ', chalk.magenta(`http://localhost:${env.PORT}${env.MOUNT_POINT || '/'}`));
      console.log('Server log is written to ', chalk.magenta('./target/server.log'));
    }

    mkdirp.sync(path.resolve('target'));
    server = spawn('node', [serverScript], {env});
    [server.stdout, server.stderr].forEach(stream =>
      stream.on('data', writeToServerLog)
    );

    const displayErrors = debounce(() => {
      console.log(
        chalk.red('There are errors! Please check'),
        chalk.magenta('./target/server.log')
      );
    }, 500);

    server.stderr.on('data', buffer => {
      if (buffer.toString().includes('wix:error')) {
        displayErrors();
      }
    });
  });
};
