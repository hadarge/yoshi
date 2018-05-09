/* eslint-env jasmine, protractor */

const path = require('path');
const ld = require('lodash');
const sass = require('node-sass');
const { wixCssModulesRequireHook } = require('yoshi-runtime');
const {
  tryRequire,
  getMochaReporter,
  exists,
  inTeamCity,
} = require('../src/utils');
const globs = require('../src/globs');

// Private wix applitools key
// skip wix' key for applitools
// In case you want to use applitools & eyes.it (https://github.com/wix/eyes.it)
// in your project, please use your own key
tryRequire('../private/node_modules/wix-eyes-env');

// Private Wix environment config for screenshot reporter
// Read how to set your own params (if needed) here: https://github.com/wix/screenshot-reporter#usage
tryRequire('../private/node_modules/screenshot-reporter-env');

require('../src/require-hooks');

const userConfPath = path.resolve('protractor.conf.js');
const userConf = exists(userConfPath) ? require(userConfPath).config : null;

const shouldUseProtractorBrowserLogs =
  process.env.PROTRACTOR_BROWSER_LOGS === 'true';

const beforeLaunch = (userConf && userConf.beforeLaunch) || ld.noop;
const onPrepare = (userConf && userConf.onPrepare) || ld.noop;

const merged = ld.mergeWith(
  {
    framework: 'jasmine',
    specs: [globs.e2e()],
    directConnect: true,

    beforeLaunch: () => {
      const rootDir = './src';
      wixCssModulesRequireHook(rootDir, {
        preprocessCss: (data, file) =>
          sass.renderSync({
            data,
            file,
            includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
          }).css,
      });

      require('../src/require-hooks');

      return beforeLaunch.call(merged);
    },
    onPrepare: () => {
      if (shouldUseProtractorBrowserLogs) {
        setupProtractorLogs();
      }

      if (merged.framework === 'jasmine' && inTeamCity()) {
        const TeamCityReporter = require('jasmine-reporters').TeamCityReporter;
        jasmine.getEnv().addReporter(new TeamCityReporter());
      }

      try {
        const ScreenshotReporter = require('screenshot-reporter');
        jasmine.getEnv().addReporter(new ScreenshotReporter());
      } catch (e) {}

      return onPrepare.call(merged);
    },
    mochaOpts: {
      timeout: 30000,
      reporter: getMochaReporter(),
    },
  },
  userConf,
  a => (typeof a === 'function' ? a : undefined),
);

function normaliseSpecs(config) {
  const specs = [].concat(config.specs || []);
  return Object.assign({}, config, {
    specs: specs.map(spec => path.resolve(spec)),
  });
}

function setupProtractorLogs() {
  const browserLogs = require('protractor-browser-logs');
  const logs = (global.logs = browserLogs(browser));

  beforeEach(() => {
    logs.reset();

    logs.ignore(logs.DEBUG);
    logs.ignore(logs.INFO);
    logs.ignore(logs.LOG);

    logs.ignore('favicon.ico');
    logs.ignore('cast_sender.js');
  });

  afterEach(logs.verify);
}

module.exports.config = normaliseSpecs(merged);
