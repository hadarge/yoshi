import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import chalk from 'chalk';
import { TARGET_DIR, BUILD_DIR } from 'yoshi-config/paths';
import DevEnvironment from 'yoshi-common/dev-environment';
import openBrowser from 'yoshi-common/open-browser';
import { isWebWorkerBundle } from 'yoshi-helpers/queries';
import { cliCommand } from '../bin/yoshi-app';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
  createWebWorkerWebpackConfig,
} from '../webpack.config';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

const start: cliCommand = async function(argv, config) {
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
    '--production': shouldRunAsProduction,
    '--https': shouldUseHttps = config.servers.cdn.ssl,
  } = args;

  if (help) {
    console.log(
      `
      Description
        Starts the application in development mode

      Usage
        $ yoshi-app start

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

  console.log(chalk.cyan('Starting development environment...\n'));

  if (shouldRunAsProduction) {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
  }

  await Promise.all([
    fs.emptyDir(join(BUILD_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
  ]);

  const clientConfig = createClientWebpackConfig(config, {
    isDev: true,
    isHot: config.hmr as boolean,
  });

  const serverConfig = createServerWebpackConfig(config, {
    isDev: true,
    isHot: true,
  });

  let webWorkerConfig;

  if (isWebWorkerBundle) {
    webWorkerConfig = createWebWorkerWebpackConfig(config, {
      isDev: true,
      isHot: true,
    });
  }

  const devEnvironment = await DevEnvironment.create({
    webpackConfigs: [clientConfig, serverConfig, webWorkerConfig],
    publicPath: config.servers.cdn.url,
    https: shouldUseHttps,
    port: config.servers.cdn.port,
    serverFilePath: serverEntry,
    enableClientHotUpdates: Boolean(config.hmr),
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

  openBrowser(url || config.startUrl || `http://localhost:3000`);
};

export default start;
