/* eslint-disable no-throw-literal */
// Assign env vars before requiring anything so that it is available to all files
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const minimist = require('minimist');
const { createRunner } = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('../globs');
const projectConfig = require('../../config/project');
const {
  watchMode,
  hasProtractorConfigFile,
  getMochaReporter,
  hasE2ETests,
  watch,
} = require('../utils');
const protractor = require('../../src/tasks/protractor');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const cliArgs = minimist(process.argv.slice(2));
const noOptions =
  !cliArgs.mocha &&
  !cliArgs.jasmine &&
  !cliArgs.karma &&
  !cliArgs.jest &&
  !cliArgs.protractor;

if (noOptions) {
  cliArgs.mocha = true;
  cliArgs.protractor = true;
}

const debugPort = cliArgs.debug;
const debugBrkPort = cliArgs['debug-brk'];
const shouldWatch = cliArgs.watch || cliArgs.w || watchMode();
const shouldRunProtractor =
  cliArgs.protractor && hasProtractorConfigFile() && !shouldWatch;
const shouldRunPuppeteer =
  hasE2ETests() && !shouldWatch && !hasProtractorConfigFile();

module.exports = runner.command(
  async tasks => {
    const { karma, webpack } = tasks;

    const wixCdn = tasks[require.resolve('../tasks/cdn/index')];
    const specsPattern = [projectConfig.specs.node() || globs.specs()];

    function bootstrapCdn() {
      return wixCdn(
        {
          port: projectConfig.servers.cdn.port(),
          ssl: projectConfig.servers.cdn.ssl(),
          publicPath: projectConfig.servers.cdn.url(),
          statics: projectConfig.clientFilesPath(),
        },
        { title: 'cdn' },
      );
    }

    if (cliArgs.mocha) {
      if (shouldRunPuppeteer) {
        specsPattern.push(globs.e2e());
        await bootstrapCdn();
      }

      const mochaArgs = [
        require.resolve('mocha/bin/_mocha'),
        ...specsPattern,
        `--require=${require.resolve('../../config/test-setup')}`,
        '--timeout=30000',
        `--reporter=${getMochaReporter()}`,
      ];

      if (cliArgs.coverage) {
        mochaArgs.unshift(require.resolve('nyc/bin/nyc'));
      }

      if (debugBrkPort !== undefined) {
        mochaArgs.unshift(`--inspect-brk=${debugBrkPort}`);
        mochaArgs.push('--no-timeouts');
      } else if (debugPort !== undefined) {
        mochaArgs.unshift(`--inspect=${debugPort}`);
        mochaArgs.push('--no-timeouts');
      }

      const runMocha = async errorHandler => {
        try {
          await execa('node', mochaArgs, { stdio: 'inherit' });
        } catch (error) {
          return errorHandler && errorHandler(error);
        }
      };

      if (shouldWatch) {
        watch({ pattern: [globs.testFilesWatch()] }, async () => {
          await runMocha(); // fail silently
        });

        await runMocha(); // fail silently
      } else {
        await runMocha(error => {
          throw `mocha failed with status code "${error.code}"`;
        });
      }
    }

    if (cliArgs.jasmine) {
      const jasmineJsonPath = path.join(process.cwd(), 'test', 'jasmine.json');

      const jasmineConfig = fs.existsSync(jasmineJsonPath)
        ? jasmineJsonPath
        : require.resolve('../../config/jasmine-config');

      const jasmineArgs = [
        require.resolve('jasmine/bin/jasmine'),
        `--config=${jasmineConfig}`,
      ];

      if (cliArgs.coverage) {
        jasmineArgs.unshift(require.resolve('nyc/bin/nyc'));
      }

      try {
        await execa('node', jasmineArgs, { stdio: 'inherit' });
      } catch (error) {
        if (!shouldWatch) {
          throw `jasmine failed with status code "${error.code}"`;
        }
      }

      if (shouldWatch) {
        watch(
          {
            pattern: [
              globs.specs(),
              path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'),
              'index.js',
            ],
          },
          async () => {
            await execa('node', jasmineArgs, { stdio: 'inherit' });
          },
        );
      }
    }

    if (cliArgs.jest) {
      if (!shouldWatch) {
        await bootstrapCdn();
      }

      const configPath = require.resolve('../../config/jest.config.js');

      const jestCliOptions = [
        require.resolve('jest/bin/jest'),
        `--config=${configPath}`,
        `--rootDir=${process.cwd()}`,
        shouldWatch ? '--watch' : '',
        cliArgs.coverage ? '--coverage' : '',
        cliArgs.runInBand ? '--runInBand' : '',
        cliArgs.forceExit ? '--forceExit' : '',
      ];

      if (debugBrkPort !== undefined) {
        jestCliOptions.unshift(`--inspect-brk=${debugBrkPort}`);
        jestCliOptions.push(`--runInBand`);
      } else if (debugPort !== undefined) {
        jestCliOptions.unshift(`--inspect=${debugPort}`);
        jestCliOptions.push(`--runInBand`);
      }

      try {
        await execa('node', jestCliOptions, { stdio: 'inherit' });
      } catch (error) {
        throw `jest failed with status code "${error.code}"`;
      }
    }

    if (cliArgs.karma) {
      await webpack({
        configPath: require.resolve('../../config/webpack.config.specs'),
        watch: shouldWatch,
      });

      await karma({
        configFile: path.join(__dirname, '../../config/karma.conf'),
        singleRun: !shouldWatch,
        autoWatch: shouldWatch,
      });
    }

    if (shouldRunProtractor) {
      await bootstrapCdn();
      return protractor(debugPort, debugBrkPort);
    }
  },
  { persistent: shouldWatch },
);
