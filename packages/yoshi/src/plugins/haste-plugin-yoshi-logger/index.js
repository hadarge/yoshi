const chalk = require('chalk');
const { format, delta, generateRunTitle } = require('./utils');
const get = require('lodash/get');

module.exports = class LoggerPlugin {
  apply(runner) {
    runner.hooks.beforeExecution.tapPromise('logger', async execution => {
      execution.hooks.createTask.tap('pipe streams', task => {
        const maxListeners = 100;

        process.stdout.setMaxListeners(maxListeners);
        process.stderr.setMaxListeners(maxListeners);

        task.pool.stdout.pipe(process.stdout);
        task.pool.stderr.pipe(process.stderr);

        task.hooks.before.tap('log start', run => {
          const start = new Date();

          const title = generateRunTitle({ run, task });
          const showLogs = get(run, 'runnerOptions.log', true);

          if (showLogs) {
            console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${title}'...`);

            run.hooks.success.tap('log success', () => {
              const [end, time] = delta(start);
              console.log(
                `[${format(end)}] ${chalk.black.bgCyan('Finished')} '${title}' after ${time} ms`,
              );
            });
          }

          run.hooks.failure.tap('log failure', () => {
            const [end, time] = delta(start);
            console.log(
              `[${format(end)}] ${chalk.white.bgRed('Failed')} '${title}' after ${time} ms`,
            );
          });
        });
      });
    });
  }
};
