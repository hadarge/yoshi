const path = require('path');
const minimist = require('minimist');
const {createRunner} = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('../globs');
const projectConfig = require('../../config/project');
const {inTeamCity, watchMode, hasProtractorConfigFile, getMochaReporter, watch} = require('../utils');
const merge = require('lodash/merge');
const crossSpawn = require('cross-spawn');

const runner = createRunner({
  logger: new LoggerPlugin()
});

const cliArgs = minimist(process.argv.slice(2));

const shouldWatch = cliArgs.watch || watchMode();

module.exports = runner.command(async tasks => {
  const {mocha, jasmine, karma, protractor, webpack, wixCdn} = tasks;

  const noOptions = !cliArgs.mocha &&
    !cliArgs.jasmine &&
    !cliArgs.karma &&
    !cliArgs.jest &&
    !cliArgs.protractor;

  if (noOptions) {
    cliArgs.mocha = true;
    cliArgs.protractor = true;
  }

  await wixCdn({
    port: projectConfig.servers.cdn.port(),
    ssl: projectConfig.servers.cdn.ssl(),
    publicPath: projectConfig.servers.cdn.url(),
    statics: projectConfig.clientFilesPath(),
  });

  const specsPattern = [projectConfig.specs.node() || globs.specs()];
  if (!hasProtractorConfigFile()) {
    specsPattern.push(globs.e2e());
  }

  if (cliArgs.mocha) {
    const options = {
      requireFiles: [require.resolve('../../config/test-setup')],
      timeout: 30000,
      reporter: getMochaReporter(),
    };

    await mocha({pattern: specsPattern, ...options});

    if (shouldWatch) {
      watch({pattern: [globs.specs(), path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'), 'index.js']}, () =>
        mocha({pattern: globs.specs(), ...options})
      );
    }
  }

  if (cliArgs.jasmine) {
    const options = {
      config: {
        spec_dir: '', //eslint-disable-line camelcase
        spec_files: [ //eslint-disable-line camelcase
          projectConfig.specs.node() || globs.specs()
        ],
        helpers: [
          path.join(__dirname, '../../config/test-setup.js')
        ]
      },
      reportersPath: require.resolve('../../config/jasmine-reporters'),
    };

    await jasmine({pattern: specsPattern, ...options});

    if (shouldWatch) {
      watch({pattern: [globs.specs(), path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'), 'index.js']}, () => {
        jasmine({pattern: projectConfig.specs.node() || globs.specs(), ...options});
      });
    }
  }

  if (cliArgs.jest) {
    const jestProjectConfig = projectConfig.jestConfig();

    const config = merge(jestProjectConfig, {
      transform: {
        '\\.jsx?$': require.resolve('../../config/jest-transformer')
      },
    });

    if (inTeamCity()) {
      config.testResultsProcessor = require.resolve('jest-teamcity-reporter');
    }

    const jestCliOptions = [`--config=${JSON.stringify(config)}`, shouldWatch ? '--watch' : ''];

    return new Promise((resolve, reject) => {
      const jest = crossSpawn(require.resolve('jest-cli/bin/jest'), jestCliOptions, {stdio: 'inherit'});

      jest.on('exit', code => {
        code === 0 ? resolve() : reject(`jest failed with status code "${code}"`);
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
    // Only install specific version of chrome driver in CI, install latest locally
    const webdriverManagerOptions = !!process.env.IS_BUILD_AGENT ? // eslint-disable-line no-extra-boolean-cast
      {'versions.chrome': '2.29'} : {};

    await protractor({
      webdriverManagerOptions,
      configPath: require.resolve('../../config/protractor.conf.js')
    });
  }
}, {persistent: shouldWatch});
