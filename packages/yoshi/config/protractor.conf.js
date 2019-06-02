/* eslint-env jasmine, protractor */

const path = require('path');
const ld = require('lodash');
const { wixCssModulesRequireHook } = require('yoshi-runtime');
const {
  inTeamCity,
  exists,
  shouldDeployToCDN,
} = require('yoshi-helpers/queries');
const {
  getMochaReporter,
  getProjectCDNBasePath,
} = require('yoshi-helpers/utils');
const { setupRequireHooks } = require('yoshi-helpers/require-hooks');
const startRewriteForwardProxy = require('yoshi-helpers/rewrite-forward-proxy');
const globs = require('yoshi-config/globs');
const project = require('yoshi-config');

setupRequireHooks();

const userConfPath = path.resolve('protractor.conf.js');
const userConf = exists(userConfPath) ? require(userConfPath).config : null;

const shouldUseProtractorBrowserLogs =
  process.env.PROTRACTOR_BROWSER_LOGS === 'true';

const beforeLaunch = (userConf && userConf.beforeLaunch) || ld.noop;
const onPrepare = (userConf && userConf.onPrepare) || ld.noop;

const forwardProxyPort = process.env.FORWARD_PROXY_PORT || 3333;

const merged = ld.mergeWith(
  {
    framework: 'jasmine',
    specs: globs.e2eTests,
    exclude: [],
    directConnect: true,

    ...(shouldDeployToCDN() && {
      capabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: [
            'ignore-certificate-errors',
            `proxy-server=127.0.0.1:${forwardProxyPort}`,
            'disable-extensions',
            'disable-plugins',
          ],
        },
      },
    }),

    beforeLaunch: () => {
      const rootDir = './src';
      wixCssModulesRequireHook(rootDir, {
        preprocessCss: (data, file) =>
          require('node-sass').renderSync({
            data,
            file,
            includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
          }).css,
      });

      if (shouldDeployToCDN()) {
        startRewriteForwardProxy({
          search: getProjectCDNBasePath(),
          rewrite: project.servers.cdn.url,
          port: forwardProxyPort,
        });
      }

      setupRequireHooks();

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
  const exclude = [].concat(config.exclude || []);

  return Object.assign({}, config, {
    specs: specs.map(spec => path.resolve(spec)),
    exclude: exclude.map(spec => path.resolve(spec)),
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
