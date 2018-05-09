const { createRunner } = require('haste-core');
const parseArgs = require('minimist');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('../globs');
const {
  runIndividualTranspiler,
  petriSpecsConfig,
  clientProjectName,
  isAngularProject,
  clientFilesPath,
} = require('../../config/project');
const {
  watchMode,
  isTypescriptProject,
  isBabelProject,
  shouldExportModule,
  shouldRunWebpack,
  shouldRunLess,
  shouldRunSass,
} = require('../utils');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = runner.command(
  async tasks => {
    if (shouldWatch) {
      return;
    }

    const {
      less,
      clean,
      copy,
      babel,
      sass,
      webpack,
      typescript,
      ngAnnotate,
    } = tasks;

    const migrateScopePackages =
      tasks[require.resolve('../tasks/migrate-to-scoped-packages')];
    const migrateBowerArtifactory =
      tasks[require.resolve('../tasks/migrate-bower-artifactory')];
    const wixUpdateNodeVersion =
      tasks[require.resolve('../tasks/update-node-version')];
    const wixPetriSpecs = tasks[require.resolve('../tasks/petri-specs')];
    const wixMavenStatics = tasks[require.resolve('../tasks/maven-statics')];
    const wixDepCheck = tasks[require.resolve('../tasks/dep-check')];

    await Promise.all([
      clean({ pattern: `{dist,target}/*` }),
      wixUpdateNodeVersion({}, { title: 'update-node-version', log: false }),
      migrateScopePackages(
        {},
        { title: 'scope-packages-migration', log: false },
      ),
      migrateBowerArtifactory(
        {},
        { title: 'migrate-bower-artifactory', log: false },
      ),
      wixDepCheck({}, { title: 'dep-check', log: false }),
    ]);

    const esTarget = shouldExportModule();

    await Promise.all([
      transpileJavascript({ esTarget }).then(() => transpileNgAnnotate()),
      ...transpileCss({ esTarget }),
      ...copyAssets({ esTarget }),
      bundle(),
      wixPetriSpecs(
        { config: petriSpecsConfig() },
        { title: 'petri-specs', log: false },
      ),
      wixMavenStatics(
        {
          clientProjectName: clientProjectName(),
          staticsDir: clientFilesPath(),
        },
        { title: 'maven-statics', log: false },
      ),
    ]);

    function bundle() {
      const configPath = require.resolve('../../config/webpack.config.client');
      const productionCallbackPath = require.resolve(
        '../webpack-production-callback',
      );
      const developmentCallbackPath = require.resolve(
        '../webpack-development-callback',
      );
      const webpackConfig = require(configPath)();

      const defaultOptions = {
        configPath,
      };

      if (shouldRunWebpack(webpackConfig)) {
        return Promise.all([
          webpack(
            {
              ...defaultOptions,
              callbackPath: productionCallbackPath,
              configParams: { debug: false, analyze: cliArgs.analyze },
            },
            { title: 'webpack-production' },
          ),
          webpack(
            {
              ...defaultOptions,
              callbackPath: developmentCallbackPath,
              configParams: { debug: true },
            },
            { title: 'webpack-development' },
          ),
        ]);
      }

      return Promise.resolve();
    }

    function copyServerAssets({ esTarget } = {}) {
      return copy(
        {
          pattern: [
            `${globs.base()}/assets/**/*`,
            `${globs.base()}/**/*.{ejs,html,vm}`,
            `${globs.base()}/**/*.{css,json,d.ts}`,
          ],
          target: globs.dist({ esTarget }),
        },
        { title: 'copy-server-assets', log: false },
      );
    }

    function copyLegacyAssets() {
      return copy(
        {
          pattern: [
            `${globs.assetsLegacyBase()}/assets/**/*`,
            `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
          ],
          target: 'dist/statics',
        },
        { title: 'copy-static-assets-legacy', log: false },
      );
    }

    function copyStaticAssets() {
      return copy(
        {
          pattern: [`assets/**/*`, `**/*.{ejs,html,vm}`],
          source: globs.assetsBase(),
          target: 'dist/statics',
        },
        { title: 'copy-static-assets', log: false },
      );
    }

    function copyAssets({ esTarget } = {}) {
      return [
        copyServerAssets(),
        esTarget && copyServerAssets({ esTarget }),
        copyLegacyAssets(),
        copyStaticAssets(),
      ].filter(Boolean);
    }

    function transpileSass({ esTarget } = {}) {
      return sass({
        pattern: globs.scss(),
        target: globs.dist({ esTarget }),
        options: {
          includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
        },
      });
    }

    function transpileLess({ esTarget } = {}) {
      return less({
        pattern: globs.less(),
        target: globs.dist({ esTarget }),
        options: { paths: ['.', 'node_modules'] },
      });
    }

    function transpileCss({ esTarget } = {}) {
      const result = [];
      if (shouldRunSass()) {
        result.push(
          ...[transpileSass(), esTarget && transpileSass({ esTarget })],
        );
      }
      if (shouldRunLess()) {
        result.push(
          ...[transpileLess(), esTarget && transpileLess({ esTarget })],
        );
      }
      return result.filter(Boolean);
    }

    function transpileNgAnnotate() {
      if (isAngularProject()) {
        return ngAnnotate({
          glob: 'dist/' + globs.base(),
        });
      }
    }

    function transpileJavascript({ esTarget } = {}) {
      if (isTypescriptProject() && runIndividualTranspiler()) {
        return typescript({
          project: 'tsconfig.json',
          rootDir: '.',
          outDir: './dist/',
        });
      }

      if (isBabelProject() && runIndividualTranspiler()) {
        const transformOptions = {
          pattern: globs.babel(),
          target: globs.dist(),
        };
        const babelTransformsChain = [];
        if (esTarget) {
          transformOptions.plugins = [
            require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
          ];
          babelTransformsChain.push(
            babel({ pattern: globs.babel(), target: globs.dist({ esTarget }) }),
          );
        }
        return Promise.all([...babelTransformsChain, babel(transformOptions)]);
      }

      return Promise.resolve();
    }
  },
  { persistent: !!cliArgs.analyze },
);
