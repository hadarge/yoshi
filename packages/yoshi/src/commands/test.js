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
  watch,
} = require('../utils');
const protractor = require('../../src/tasks/protractor');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const cliArgs = minimist(process.argv.slice(2));
const debugPort = cliArgs.debug;
const debugBrkPort = cliArgs['debug-brk'];
const shouldWatch = cliArgs.watch || cliArgs.w || watchMode();

module.exports = runner.command(
  async tasks => {
    const { karma, webpack } = tasks;

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

    const wixCdn = tasks[require.resolve('../tasks/cdn/index')];
    const specsPattern = [projectConfig.specs.node() || globs.specs()];

    if (!shouldWatch) {
      await wixCdn(
        {
          port: projectConfig.servers.cdn.port(),
          ssl: projectConfig.servers.cdn.ssl(),
          publicPath: projectConfig.servers.cdn.url(),
          statics: projectConfig.clientFilesPath(),
        },
        { title: 'cdn' },
      );

      if (!hasProtractorConfigFile()) {
        specsPattern.push(globs.e2e());
      }
    }

    if (cliArgs.mocha) {
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

      if (shouldWatch) {
        watch({ pattern: [globs.testFilesWatch()] }, async () => {
          try {
            await execa('node', mochaArgs, { stdio: 'inherit' });
          } catch (error) {
            throw `mocha failed with status code "${error.code}"`;
          }
        });
      }

      try {
        await execa('node', mochaArgs, { stdio: 'inherit' });
      } catch (error) {
        throw `mocha failed with status code "${error.code}"`;
      }
    }

    if (cliArgs.jasmine) {
      const jasmineArgs = [
        require.resolve('jasmine/bin/jasmine'),
        `--config=${require.resolve('../../config/jasmine-config')}`,
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
      const config = require('../../config/jest.config.js');
      const jestCliOptions = [
        require.resolve('jest-cli/bin/jest'),
        `--config=${JSON.stringify(config)}`,
        shouldWatch ? '--watch' : '',
        cliArgs.coverage ? '--coverage' : '',
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

    if (cliArgs.protractor && hasProtractorConfigFile() && !shouldWatch) {
      return protractor(debugPort, debugBrkPort);
    }
  },
  { persistent: shouldWatch },
);
