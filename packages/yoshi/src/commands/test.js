const path = require('path');
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
const crossSpawn = require('cross-spawn');
const protractor = require('../../src/tasks/protractor');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const cliArgs = minimist(process.argv.slice(2));
const isDebugOn = !!cliArgs.debug;
const debugPort = cliArgs.debug;

const shouldWatch = cliArgs.watch || cliArgs.w || watchMode();

module.exports = runner.command(
  async tasks => {
    const { jasmine, karma, webpack } = tasks;

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

      if (isDebugOn) {
        mochaArgs.unshift(`--inspect=${debugPort}`);
        mochaArgs.push('--no-timeouts');
      }

      if (shouldWatch) {
        mochaArgs.push('--watch');
        mochaArgs.push('--watch-extensions=js,jsx,ts,tsx');
      }
      return new Promise((resolve, reject) => {
        const mochaSpawn = crossSpawn('node', mochaArgs, { stdio: 'inherit' });
        mochaSpawn.on('exit', code => {
          code === 0
            ? resolve()
            : reject(`mocha failed with status code "${code}"`);
        });
      });
    }

    if (cliArgs.jasmine) {
      const options = {
        config: {
          spec_dir: '', //eslint-disable-line camelcase
          spec_files: [
            //eslint-disable-line camelcase
            projectConfig.specs.node() || globs.specs(),
          ],
          helpers: [path.join(__dirname, '../../config/test-setup.js')],
        },
        reportersPath: require.resolve('../../config/jasmine-reporters'),
      };

      await jasmine({ pattern: specsPattern, ...options });

      if (shouldWatch) {
        watch(
          {
            pattern: [
              globs.specs(),
              path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'),
              'index.js',
            ],
          },
          () => {
            jasmine({
              pattern: projectConfig.specs.node() || globs.specs(),
              ...options,
            });
          },
        );
      }
    }

    if (cliArgs.jest) {
      const config = require('../../config/jest.config.js');
      const jestCliOptions = [
        require.resolve('jest/bin/jest'),
        `--config=${JSON.stringify(config)}`,
        shouldWatch ? '--watch' : '',
      ];

      if (isDebugOn) {
        jestCliOptions.unshift(`--inspect=${debugPort}`);
        jestCliOptions.push(`--runInBand`);
      }
      return new Promise((resolve, reject) => {
        const jest = crossSpawn('node', jestCliOptions, { stdio: 'inherit' });
        jest.on('exit', code => {
          code === 0
            ? resolve()
            : reject(`jest failed with status code "${code}"`);
        });
      });
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
      return protractor(debugPort);
    }
  },
  { persistent: shouldWatch },
);
