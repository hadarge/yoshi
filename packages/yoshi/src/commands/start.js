const { createRunner } = require('haste-core');
const path = require('path');
const parseArgs = require('minimist');
const crossSpawn = require('cross-spawn');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const {
  clientFilesPath,
  servers,
  entry,
  defaultEntry,
  hmr,
  petriSpecsConfig,
  clientProjectName,
} = require('../../config/project');
const globs = require('../globs');
const {
  isTypescriptProject,
  isBabelProject,
  shouldRunLess,
  shouldRunSass,
  shouldTransformHMRRuntime,
  suffix,
  watch,
} = require('../utils');
const { debounce } = require('lodash');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const addJsSuffix = suffix('.js');
const cliArgs = parseArgs(process.argv.slice(2));
const shouldRunTests = cliArgs.test !== false;
const debugPort = cliArgs.debug;
const entryPoint = addJsSuffix(cliArgs['entry-point'] || 'index.js');

module.exports = runner.command(
  async tasks => {
    const { sass, less, copy, clean, babel, typescript } = tasks;

    const wixAppServer = tasks[require.resolve('../tasks/app-server')];
    const wixCdn = tasks[require.resolve('../tasks/cdn')];
    const migrateScopePackages =
      tasks[require.resolve('../tasks/migrate-to-scoped-packages')];
    const migrateBowerArtifactory =
      tasks[require.resolve('../tasks/migrate-bower-artifactory')];
    const wixUpdateNodeVersion =
      tasks[require.resolve('../tasks/update-node-version')];
    const wixPetriSpecs = tasks[require.resolve('../tasks/petri-specs')];
    const wixMavenStatics = tasks[require.resolve('../tasks/maven-statics')];
    const wixDepCheck = tasks[require.resolve('../tasks/dep-check')];

    const appServer = async () => {
      if (cliArgs['no-server']) {
        return;
      }

      return wixAppServer(
        { entryPoint, debugPort, manualRestart: cliArgs['manual-restart'] },
        { title: 'app-server' },
      );
    };

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

    const ssl = cliArgs.ssl || servers.cdn.ssl();

    await Promise.all([
      transpileJavascriptAndRunServer(),
      ...transpileCss(),
      copy(
        {
          pattern: [
            `${globs.base()}/assets/**/*`,
            `${globs.base()}/**/*.{ejs,html,vm}`,
            `${globs.base()}/**/*.{css,json,d.ts}`,
          ],
          target: 'dist',
        },
        { title: 'copy-server-assets', log: false },
      ),
      copy(
        {
          pattern: [
            `${globs.assetsLegacyBase()}/assets/**/*`,
            `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
          ],
          target: 'dist/statics',
        },
        { title: 'copy-static-assets-legacy', log: false },
      ),
      copy(
        {
          pattern: [`assets/**/*`, `**/*.{ejs,html,vm}`],
          source: globs.assetsBase(),
          target: 'dist/statics',
        },
        { title: 'copy-static-assets', log: false },
      ),
      wixCdn(
        {
          port: servers.cdn.port(),
          ssl,
          publicPath: servers.cdn.url(ssl),
          statics: clientFilesPath(),
          webpackConfigPath: require.resolve(
            '../../config/webpack.config.client',
          ),
          configuredEntry: entry(),
          defaultEntry: defaultEntry(),
          hmr: hmr(),
          transformHMRRuntime: shouldTransformHMRRuntime(),
        },
        { title: 'cdn' },
      ),
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

    if (shouldRunTests) {
      crossSpawn('npm', ['test', '--silent'], {
        stdio: 'inherit',
        env: {
          ...process.env,
          WIX_NODE_BUILD_WATCH_MODE: 'true',
        },
      });
    }

    watch(
      {
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
          `${globs.base()}/**/*.{css,json,d.ts}`,
        ],
      },
      changed => copy({ pattern: changed, target: 'dist' }),
    );

    watch(
      {
        pattern: [
          `${globs.assetsLegacyBase()}/assets/**/*`,
          `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
        ],
      },
      changed => copy({ pattern: changed, target: 'dist/statics' }),
    );

    watch(
      {
        pattern: [`assets/**/*`, `**/*.{ejs,html,vm}`],
        cwd: path.resolve(globs.assetsBase()),
      },
      changed =>
        copy({
          pattern: changed,
          target: 'dist/statics',
          source: globs.assetsBase(),
        }),
    );

    function transpileCss() {
      if (shouldRunSass()) {
        watch({ pattern: globs.scss() }, changed =>
          sass({
            pattern: changed,
            target: 'dist',
            options: {
              includePaths: ['node_modules', 'node_modules/compass-mixins/lib'],
            },
          }),
        );
      }

      if (shouldRunLess()) {
        watch({ pattern: globs.less() }, changed =>
          less({
            pattern: changed,
            target: 'dist',
            paths: ['.', 'node_modules'],
          }),
        );
      }

      return [
        !shouldRunSass()
          ? null
          : sass({
              pattern: globs.scss(),
              target: 'dist',
              options: {
                includePaths: [
                  'node_modules',
                  'node_modules/compass-mixins/lib',
                ],
              },
            }),
        !shouldRunLess()
          ? null
          : less({
              pattern: globs.less(),
              target: 'dist',
              paths: ['.', 'node_modules'],
            }),
      ].filter(a => a);
    }

    async function transpileJavascriptAndRunServer() {
      if (isTypescriptProject()) {
        await typescript({
          watch: true,
          project: 'tsconfig.json',
          rootDir: '.',
          outDir: './dist/',
        });
        await appServer();

        return watch(
          { pattern: [path.join('dist', '**', '*.js'), 'index.js'] },
          debounce(appServer, 500, { maxWait: 1000 }),
        );
      }

      if (isBabelProject()) {
        watch(
          { pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js'] },
          async changed => {
            await babel({ pattern: changed, target: 'dist', sourceMaps: true });
            await appServer();
          },
        );

        await babel({
          pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js'],
          target: 'dist',
          sourceMaps: true,
        });
        return appServer();
      }

      watch({ pattern: globs.babel() }, appServer);

      return appServer();
    }
  },
  { persistent: true },
);
