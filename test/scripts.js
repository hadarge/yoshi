const execa = require('execa');
const terminate = require('terminate');
const { promisify } = require('util');
const { waitForPort } = require('./utils');

const terminateAsync = promisify(terminate);

const defaultOptions = {
  FORCE_COLOR: '0',
  BROWSER: 'none',
};

module.exports = class Scripts {
  constructor(testDirectory) {
    this.testDirectory = testDirectory;
  }

  async start(env) {
    const port = 3000;

    const startProcess = execa('npx', ['yoshi', 'start'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        PORT: port,
        ...defaultOptions,
        ...env,
      },
    });

    // `startProcess` will never resolve but if it fails this
    // promise will reject immediately
    await Promise.race([waitForPort(port), startProcess]);

    return {
      port,
      done() {
        return terminate(startProcess.pid);
      },
    };
  }

  analyze(env = {}) {
    const buildProcess = execa('npx', ['yoshi', 'build', '--analyze'], {
      cwd: this.testDirectory,
      env: {
        ...defaultOptions,
        ...env,
      },
      // stdio: 'inherit',
    });

    return {
      done() {
        return terminate(buildProcess.pid);
      },
    };
  }

  async build(env = {}) {
    return execa('npx', ['yoshi', 'build'], {
      cwd: this.testDirectory,
      env: {
        ...defaultOptions,
        ...env,
      },
      // stdio: 'inherit',
    });
  }

  async serve() {
    const staticsServerPort = 3200;
    const appServerProcessPort = 3000;

    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.testDirectory,
        // stdio: 'inherit',
      },
    );

    const appServerProcess = execa('node', ['index.js'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        PORT: appServerProcessPort,
      },
    });

    await waitForPort(staticsServerPort);
    await waitForPort(appServerProcessPort);

    return {
      staticsServerPort,
      appServerProcessPort,
      done() {
        return Promise.all([
          terminateAsync(staticsServerProcess.pid),
          terminateAsync(appServerProcess.pid),
        ]);
      },
    };
  }
};
