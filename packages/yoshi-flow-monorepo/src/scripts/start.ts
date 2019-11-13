import arg from 'arg';
import chalk from 'chalk';
import DevEnvironment from 'yoshi-common/dev-environment';
import openBrowser from 'yoshi-common/open-browser';
import { cliCommand } from '../bin/yoshi-monorepo';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
} from '../webpack.config';

const start: cliCommand = async function(argv, rootConfig, { apps }) {
  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--server': String,
      '--url': String,
      '--production': Boolean,
      '--https': Boolean,
      '--debug': Boolean,
      '--debug-brk': Boolean,

      // Aliases
      '--entry-point': '--server',
      '-e': '--server',
      '--ssl': '--https',
    },
    { argv },
  );

  const {
    '--help': help,
    '--server': serverEntry = 'index.js',
    '--url': url,
    // '--production': shouldRunAsProduction,
    '--https': shouldUseHttps = rootConfig.servers.cdn.ssl,
    _: extraArgs,
  } = args;

  const [appName] = extraArgs;

  if (help) {
    console.log(
      `
      Description
        Starts the application in development mode

      Usage
        $ yoshi-monorepo start

      Options
        --help, -h      Displays this message
        --server        The main file to start your server
        --url           Opens the browser with the supplied URL
        --production    Start using unminified production build
        --https         Serve the app bundle on https
        --debug         Allow app-server debugging
        --debug-brk     Allow app-server debugging, process won't start until debugger will be attached
    `,
    );

    process.exit(0);
  }

  if (!appName) {
    console.log(
      chalk.red(
        `Please choose which app to start by running \`npx yoshi start <appName>\``,
      ),
    );
    console.log();
    console.log(chalk.red('Aborting'));

    return process.exit(1);
  }

  const pkg = apps.find(pkg => pkg.name === appName);

  if (!pkg) {
    console.log(
      chalk.red(`Could not find an app with the name of ${appName} to start`),
    );
    console.log();
    console.log(chalk.red('Aborting'));

    return process.exit(1);
  }

  const clientConfig = createClientWebpackConfig(rootConfig, pkg, {
    isDev: true,
    isHot: pkg.config.hmr as boolean,
  });

  const serverConfig = createServerWebpackConfig(rootConfig, pkg, {
    isDev: true,
    isHot: true,
  });

  const devEnvironment = await DevEnvironment.create({
    webpackConfigs: [clientConfig, serverConfig],
    publicPath: rootConfig.servers.cdn.url,
    https: shouldUseHttps,
    port: rootConfig.servers.cdn.port,
    serverFilePath: serverEntry,
    enableClientHotUpdates: Boolean(rootConfig.hmr),
  });

  devEnvironment.store.subscribe(state => {
    switch (state.status) {
      case 'compiling':
        console.log('Compiling...');
        break;

      case 'success':
        console.log(chalk.green('Compiled successfully!'));

        console.log();
        console.log(
          `Your server is starting and should be accessible from your browser.`,
        );
        console.log();

        console.log(
          `  ${chalk.bold('Local:')}            ${
            state.serverUrls.localUrlForTerminal
          }`,
        );
        console.log(
          `  ${chalk.bold('On Your Network:')}  ${
            state.serverUrls.lanUrlForTerminal
          }`,
        );

        console.log();
        console.log(
          `Your bundles and other static assets are served from your ${chalk.bold(
            'dev-server',
          )}.`,
        );
        console.log();

        console.log(
          `  ${chalk.bold('Local:')}            ${
            state.devServerUrls.localUrlForTerminal
          }`,
        );
        console.log(
          `  ${chalk.bold('On Your Network:')}  ${
            state.devServerUrls.lanUrlForTerminal
          }`,
        );

        console.log();
        console.log('Note that the development build is not optimized.');
        console.log(
          `To create a production build, use ` +
            `${chalk.cyan('npm run build')}.`,
        );
        console.log();
        break;

      case 'errors':
        console.log(chalk.red('Failed to compile.\n'));
        console.log(state.errors.join('\n\n'));
        break;

      case 'warnings':
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(state.warnings.join('\n\n'));
        break;
    }
  });

  await devEnvironment.start();

  openBrowser(url || rootConfig.startUrl || `http://localhost:3000`);
};

export default start;
