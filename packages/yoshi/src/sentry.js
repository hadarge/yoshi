const { name, version } = require('../package');
const osName = require('os-name');
const Sentry = require('@sentry/node');
const chalk = require('chalk');
const { getEnvInfo } = require('../src/env-info');
const findPkg = require('find-pkg');
const { inTeamCity } = require('yoshi-helpers/queries');
const { SENTRY_DSN } = require('./constants');

function configureSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: `${name}@${version}`,
    beforeSend(event) {
      if (event.level === Sentry.Severity.Fatal) {
        printCrashInfo(event.event_id);
      }

      return event;
    },
  });

  Sentry.configureScope(async scope => {
    scope.setTag('node-version', process.version);
    scope.setTag('os', osName());
    scope.setTag('NODE_ENV', process.env.NODE_ENV);
    scope.setTag('CI', !!inTeamCity());
  });

  process.removeAllListeners('unhandledRejection');
  process.removeAllListeners('uncaughtException');
}

function handleError(err) {
  Sentry.withScope(async scope => {
    // We are using a workaround here to set the event level to Fatal because
    // captureException doesn't allow that.
    scope.addEventProcessor(event => {
      event.level = Sentry.Severity.Fatal;
      return event;
    });

    try {
      const packageJson = require(findPkg.sync(process.cwd()));
      scope.setTag('package', packageJson.name);

      let yoshiConfig = 'Zero config';

      if (packageJson.yoshi) {
        yoshiConfig = JSON.stringify(packageJson.yoshi, null, 2);
      }

      scope.setExtra('yoshiConfig', yoshiConfig);
    } catch (_) {}

    const info = await getEnvInfo();
    scope.setExtra('envInfo', info);

    // We are capturing the exception using the client so that we can await it's result
    // before exiting the process. The `Sentry.captureException` function doesn't return
    // a promise, so we will exit the process before it finishes.
    await Sentry.getCurrentHub()
      .getClient()
      .captureException(err, undefined, scope);

    process.exit(1);
  });
}

function outputURL(url) {
  return chalk.cyan(url);
}

function printCrashInfo(eventId) {
  console.log(`
  ${chalk.redBright(
    `🤮  Oh no, Yoshi just crashed! ${chalk.yellow(`Event ID = ${eventId}`)}`,
  )}

    Here are a few options on what you can do now:

      * Help us figure out what caused the crash by submitting feedback on the error. You can do that by going to:
        ${outputURL(
          `https://wix.github.io/yoshi/error-feedback?eventId=${eventId}`,
        )}

      * Find us on slack on the #yoshi channel:
        ${outputURL('https://wix.slack.com/messages/yoshi/')}

      * Open a bug report on our github repository (be sure to include your event id):
        ${outputURL(
          `https://github.com/wix/yoshi/issues/new?template=BUG_REPORT.md`,
        )}
    `);
}

module.exports = {
  configureSentry,
  handleError,
};
