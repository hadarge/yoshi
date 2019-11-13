import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import bfj from 'bfj';
import { BUILD_DIR, TARGET_DIR, STATS_FILE } from 'yoshi-config/paths';
import { runWebpack } from 'yoshi-common/webpack-utils';
import writeManifest from 'yoshi-common/write-manifest';
import {
  printBuildResult,
  printBundleSizeSuggestion,
} from 'yoshi-common/print-build-results';
import { inTeamCity, isWebWorkerBundle } from 'yoshi-helpers/queries';
import { copyTemplates } from 'yoshi-common/copy-assets';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
  createWebWorkerWebpackConfig,
} from '../webpack.config';
import { cliCommand } from '../bin/yoshi-app';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

const build: cliCommand = async function(argv, config) {
  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--analyze': Boolean,
      '--stats': Boolean,
      '--source-map': Boolean,

      // Aliases
      '-h': '--help',
    },
    { argv },
  );

  const {
    '--help': help,
    '--analyze': isAnalyze,
    '--stats': shouldEmitWebpackStats,
    '--source-map': forceEmitSourceMaps,
  } = args;

  if (help) {
    console.log(
      `
      Description
        Compiles the application for production deployment

      Usage
        $ yoshi-app build

      Options
        --help, -h      Displays this message
        --analyze       Run webpack-bundle-analyzer
        --stats         Emit webpack's stats file on "target/webpack-stats.json"
        --source-map    Emit bundle source maps
    `,
    );

    process.exit(0);
  }

  await Promise.all([
    fs.emptyDir(join(BUILD_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
  ]);

  await copyTemplates();

  if (inTeamCity) {
    const petriSpecs = (await import('yoshi-common/sync-petri-specs')).default;
    const wixMavenStatics = (await import('yoshi-common/maven-statics'))
      .default;

    await Promise.all([
      petriSpecs({
        config: config.petriSpecsConfig,
      }),
      wixMavenStatics({
        clientProjectName: config.clientProjectName,
        staticsDir: config.clientFilesPath,
      }),
    ]);
  }

  const clientDebugConfig = createClientWebpackConfig(config, {
    isDev: true,
    forceEmitSourceMaps,
  });

  const clientOptimizedConfig = createClientWebpackConfig(config, {
    isAnalyze,
    forceEmitSourceMaps,
  });

  const serverConfig = createServerWebpackConfig(config, {
    isDev: true,
  });

  let webWorkerConfig;
  let webWorkerOptimizeConfig;

  if (isWebWorkerBundle) {
    webWorkerConfig = createWebWorkerWebpackConfig(config, {
      isDev: true,
    });

    webWorkerOptimizeConfig = createWebWorkerWebpackConfig(config);
  }

  const { stats } = await runWebpack([
    clientDebugConfig,
    clientOptimizedConfig,
    serverConfig,
    webWorkerConfig,
    webWorkerOptimizeConfig,
  ]);

  const [, clientOptimizedStats, serverStats] = stats;

  if (inTeamCity()) {
    await writeManifest(clientOptimizedConfig, clientOptimizedStats);
  }

  if (shouldEmitWebpackStats) {
    const statsFilePath = join(STATS_FILE);

    fs.ensureDirSync(path.dirname(statsFilePath));
    await bfj.write(statsFilePath, clientOptimizedStats.toJson());
  }

  printBuildResult({ webpackStats: [clientOptimizedStats, serverStats] });
  printBundleSizeSuggestion();
};

export default build;
