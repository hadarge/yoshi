const path = require('path');
const minimist = require('minimist');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('../globs');
const projectConfig = require('../../config/project');
const {inTeamCity, watchMode, hasProtractorConfigFile, getMochaReporter} = require('../utils');
const merge = require('lodash/merge');
const crossSpawn = require('cross-spawn');

const cliArgs = minimist(process.argv.slice(2));

const shouldWatch = cliArgs.watch || watchMode();

module.exports = async configure => {
  const {run, tasks, watch} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
    persistent: shouldWatch,
  });

  const {read, mocha, jasmine, karma, protractor, webpack, wixCdn} = tasks;

  const noOptions = !cliArgs.mocha &&
    !cliArgs.jasmine &&
    !cliArgs.karma &&
    !cliArgs.jest &&
    !cliArgs.protractor;

  if (noOptions || cliArgs.mocha) {
    const options = {
      requireFiles: [require.resolve('../../config/test-setup')],
      timeout: 30000,
      reporter: getMochaReporter(),
    };

    await run(
      read({pattern: projectConfig.specs.node() || globs.specs()}),
      mocha(options)
    );

    if (shouldWatch) {
      watch([globs.specs(), path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'), 'index.js'], () => run(
        read({pattern: globs.specs()}),
        mocha(options),
      ));
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

    await run(
      read({pattern: projectConfig.specs.node() || globs.specs()}),
      jasmine(options)
    );

    if (shouldWatch) {
      watch([globs.specs(), path.join(globs.base(), '**', '*.{js,jsx,ts,tsx}'), 'index.js'], () => run(
        read({pattern: globs.specs()}),
        jasmine(options),
      ));
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
    await run(
      webpack({
        configPath: require.resolve('../../config/webpack.config.specs'),
        watch: shouldWatch,
      })
    );

    await run(
      karma({
        configFile: path.join(__dirname, '../../config/karma.conf'),
        singleRun: !shouldWatch,
        autoWatch: shouldWatch,
      })
    );
  }

  if ((noOptions || cliArgs.protractor) && hasProtractorConfigFile() && !shouldWatch) {
    await run(wixCdn({
      port: projectConfig.servers.cdn.port(),
      ssl: projectConfig.servers.cdn.ssl(),
      publicPath: projectConfig.servers.cdn.url(),
      statics: projectConfig.clientFilesPath(),
    }));

    await run(
      protractor({
        webdriverManagerOptions: {'versions.chrome': '2.29', gecko: 'false'},
        configPath: require.resolve('../../config/protractor.conf.js')
      })
    );
  }
};
