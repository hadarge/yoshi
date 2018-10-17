process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const parseArgs = require('minimist');

const cliArgs = parseArgs(process.argv.slice(2));

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const globby = require('globby');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const {
  createClientWebpackConfig,
  createServerWebpackConfig,
} = require('../../config/webpack.config');
const { inTeamCity: checkInTeamCity } = require('yoshi-helpers');
const {
  SRC_DIR,
  BUILD_DIR,
  TARGET_DIR,
  PUBLIC_DIR,
  STATICS_DIR,
} = require('yoshi-config/paths');
const {
  petriSpecsConfig,
  clientProjectName,
  clientFilesPath,
} = require('yoshi-config');

const updateNodeVersion = require('../tasks/update-node-version');
const wixDepCheck = require('../tasks/dep-check');

const inTeamCity = checkInTeamCity();

const copyTemplates = async () => {
  const files = await globby('**/*.{ejs,vm}', { cwd: SRC_DIR });

  await Promise.all(
    files.map(file => {
      return fs.copy(path.join(SRC_DIR, file), path.join(STATICS_DIR, file));
    }),
  );
};

module.exports = async () => {
  // Clean tmp folders
  await Promise.all([fs.emptyDir(BUILD_DIR), fs.emptyDir(TARGET_DIR)]);

  // Copy public to statics dir
  if (await fs.exists(PUBLIC_DIR)) {
    await fs.copy(PUBLIC_DIR, STATICS_DIR);
  }

  await Promise.all([updateNodeVersion(), wixDepCheck(), copyTemplates()]);

  // Run CI related updates
  if (inTeamCity) {
    const petriSpecs = require('../tasks/petri-specs');
    const wixMavenStatics = require('../tasks/maven-statics');

    await Promise.all([
      petriSpecs({ config: petriSpecsConfig }),
      wixMavenStatics({
        clientProjectName,
        staticsDir: clientFilesPath,
      }),
    ]);
  }

  const clientDebugConfig = createClientWebpackConfig({
    isDebug: true,
    isAnalyze: false,
  });

  const clientOptimizedConfig = createClientWebpackConfig({
    isDebug: false,
    isAnalyze: cliArgs.analyze,
  });

  const serverConfig = createServerWebpackConfig({
    isDebug: true,
  });

  // Configure compilation
  const compiler = webpack([
    clientDebugConfig,
    clientOptimizedConfig,
    serverConfig,
  ]);

  return new Promise((resolve, reject) => {
    compiler.run(async (err, stats) => {
      if (err) {
        return reject(err);
      }

      const messages = formatWebpackMessages(stats.toJson({}, true));

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        return reject(new Error(messages.errors.join('\n\n')));
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  }).then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log(
        stats.toString({
          cached: false,
          cachedAssets: false,
          chunks: false,
          chunkModules: false,
          colors: true,
          hash: false,
          modules: false,
          reasons: true,
          timings: true,
          version: false,
        }),
      );

      return {
        persistent: !!cliArgs.analyze,
      };
    },
    error => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log(error.message || error);

      process.exit(1);
    },
  );
};
