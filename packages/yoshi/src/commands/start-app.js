process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2), {
  alias: {
    server: 'entry-point',
    https: 'ssl',
  },
  default: {
    server: 'index.js',
    https: false,
  },
});

if (cliArgs.production) {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
}

const rootApp = require('yoshi-config/root-app');
const startSingleApp = require('./utils/start-single-app');

module.exports = async () => {
  await startSingleApp(rootApp, cliArgs);

  return {
    persistent: true,
  };
};
