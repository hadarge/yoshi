const bfj = require('bfj');
const path = require('path');
const fs = require('fs-extra');
const {
  inTeamCity: checkInTeamCity,
  isWebWorkerBundle,
} = require('yoshi-helpers/queries');
const { copyTemplates } = require('./copy-assets');
const writeManifest = require('./write-manifest');
const {
  createClientWebpackConfig,
  createServerWebpackConfig,
  createWebWorkerWebpackConfig,
} = require('../../../config/webpack.config');
const wixDepCheck = require('../../tasks/dep-check');
const WebpackManager = require('../../webpack-manager');

const inTeamCity = checkInTeamCity();

module.exports = async function buildApps(apps, options) {
  // Clean tmp folders
  await Promise.all(
    apps.reduce((acc, app) => {
      return [...acc, fs.emptyDir(app.BUILD_DIR), fs.emptyDir(app.TARGET_DIR)];
    }, []),
  );

  // Copy public to statics dir
  Promise.all(
    apps.map(async app => {
      if (await fs.pathExists(app.PUBLIC_DIR)) {
        await fs.copy(app.PUBLIC_DIR, app.ASSETS_DIR);
      }
    }),
  );

  Promise.all(
    apps.map(async app => {
      await Promise.all([
        wixDepCheck({ cwd: app.ROOT_DIR }),
        copyTemplates(app),
      ]);
    }),
  );

  // Run CI related updates
  if (inTeamCity) {
    const petriSpecs = require('../../tasks/petri-specs');
    const wixMavenStatics = require('../../tasks/maven-statics');

    await Promise.all(
      apps.reduce((acc, app) => {
        return [
          ...acc,
          petriSpecs({ config: app.petriSpecsConfig }),
          wixMavenStatics({
            clientProjectName: app.clientProjectName,
            staticsDir: app.clientFilesPath,
          }),
        ];
      }, []),
    );
  }

  // Build apps
  const webpackManager = new WebpackManager();

  apps.forEach(app => {
    const clientDebugConfig = createClientWebpackConfig({
      app,
      isDebug: true,
      isAnalyze: false,
      isHmr: false,
      withLocalSourceMaps: options['source-map'],
    });

    const clientOptimizedConfig = createClientWebpackConfig({
      app,
      isDebug: false,
      isAnalyze: options.analyze,
      isHmr: false,
      withLocalSourceMaps: options['source-map'],
    });

    const serverConfig = createServerWebpackConfig({
      app,
      isDebug: true,
    });

    let webWorkerConfig;
    let webWorkerOptimizeConfig;

    if (isWebWorkerBundle) {
      webWorkerConfig = createWebWorkerWebpackConfig({
        isDebug: true,
      });

      webWorkerOptimizeConfig = createWebWorkerWebpackConfig({
        isDebug: false,
      });
    }

    webpackManager.addConfigs(
      app,
      [
        clientDebugConfig,
        clientOptimizedConfig,
        serverConfig,
        webWorkerConfig,
        webWorkerOptimizeConfig,
      ].filter(Boolean),
    );
  });

  const { getAppData } = await webpackManager.run();

  // Generate `manifest.[version].json` from optimized webpack bundle
  if (inTeamCity) {
    await Promise.all(
      apps.map(async app => {
        const { configs, stats } = getAppData(app);
        const [, clientOptimizedConfig] = configs;
        const [, clientOptimizedStats] = stats;

        await writeManifest(clientOptimizedConfig, clientOptimizedStats, app);
      }),
    );
  }

  // Write a Webpack stats file
  if (options.stats) {
    await Promise.all(
      apps.map(async app => {
        const { stats } = getAppData(app);
        const [, clientOptimizedStats] = stats;

        await fs.ensureDir(path.dirname(app.STATS_FILE));
        await bfj.write(app.STATS_FILE, clientOptimizedStats.toJson());
      }),
    );
  }

  return {
    getAppData,
  };
};
