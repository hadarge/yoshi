const path = require('path');
const parseArgs = require('minimist');
const crossSpawn = require('cross-spawn');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const projectConfig = require('../../config/project');
const globs = require('../globs');
const {
  isTypescriptProject,
  isBabelProject,
  shouldRunLess,
  shouldRunSass,
  suffix,
  watch,
} = require('../utils');
const {debounce} = require('lodash');

const addJsSuffix = suffix('.js');
const cliArgs = parseArgs(process.argv.slice(2));
const shouldRunTests = cliArgs.test !== false;
const entryPoint = addJsSuffix(cliArgs['entry-point'] || 'index.js');
module.exports = async configure => {
  const {run, tasks} = configure({
    persistent: true,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {
    wixCdn,
    sass,
    less,
    read,
    copy,
    clean,
    babel,
    write,
    typescript,
    wixDepCheck,
    wixPetriSpecs,
    wixMavenStatics,
    wixAppServer,
    wixUpdateNodeVersion,
  } = tasks;

  const appServer = async () => {
    if (cliArgs['no-server']) {
      return;
    }

    return run(
      wixAppServer({entryPoint, manualRestart: cliArgs['manual-restart']})
    );
  };

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(wixUpdateNodeVersion()),
    run({
      task: require.resolve('../tasks/migrate-to-scoped-packages/index'),
      metadata: {title: 'scope-packages-migration'}
    }),
    run({
      task: require.resolve('../tasks/migrate-bower-artifactory/index'),
      metadata: {title: 'migrate-bower-artifactory'}
    }),
    run(wixDepCheck())
  ]);

  await Promise.all([
    transpileJavascriptAndRunServer(),
    ...transpileCss(),
    run(
      read({
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
          `${globs.base()}/**/*.{css,json,d.ts}`,
        ]
      }),
      copy({target: 'dist'}, {title: 'copy-server-assets'})
    ),
    run(
      read({
        pattern: [
          `${globs.assetsLegacyBase()}/assets/**/*`,
          `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
        ],
      }),
      copy({target: 'dist/statics'}, {title: 'copy-static-assets-legacy'})
    ),
    run(
      read({
        pattern: [
          `assets/**/*`,
          `**/*.{ejs,html,vm}`,
        ],
        options: {cwd: path.resolve(globs.assetsBase())}
      }),
      copy({target: 'dist/statics'}, {title: 'copy-static-assets'})
    ),
    run(wixCdn({
      port: projectConfig.servers.cdn.port(),
      ssl: projectConfig.servers.cdn.ssl(),
      publicPath: projectConfig.servers.cdn.url(),
      statics: projectConfig.clientFilesPath(),
      webpackConfigPath: require.resolve('../../config/webpack.config.client'),
      configuredEntry: projectConfig.entry(),
      defaultEntry: projectConfig.defaultEntry(),
      hmr: projectConfig.hmr(),
    })),
    run(wixPetriSpecs({config: projectConfig.petriSpecsConfig()})),
    run(
      wixMavenStatics({
        clientProjectName: projectConfig.clientProjectName(),
        staticsDir: projectConfig.clientFilesPath()
      })
    ),
  ]);

  if (shouldRunTests) {
    crossSpawn('npm', ['test', '--silent'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        WIX_NODE_BUILD_WATCH_MODE: 'true'
      }
    });
  }

  watch({
    pattern: [
      `${globs.base()}/assets/**/*`,
      `${globs.base()}/**/*.{ejs,html,vm}`,
      `${globs.base()}/**/*.{css,json,d.ts}`,
    ]
  }, changed => run(
    read({pattern: changed}),
    copy({target: 'dist'}),
  ));

  watch({
    pattern: [
      `${globs.assetsLegacyBase()}/assets/**/*`,
      `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
    ]
  }, changed => run(
    read({pattern: changed}),
    copy({target: 'dist/statics'}),
  ));

  watch({
    pattern: [
      `assets/**/*`,
      `**/*.{ejs,html,vm}`,
    ],
    cwd: path.resolve(globs.assetsBase()),
  }, changed => run(
    read({pattern: changed, options: {cwd: path.resolve(globs.assetsBase())}}),
    copy({target: 'dist/statics'}),
  ));

  function transpileCss() {
    if (shouldRunSass()) {
      watch({pattern: globs.sass()}, changed => run(
        read({pattern: changed}),
        sass({
          includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
        }),
        write({target: 'dist'}),
      ));
    }

    if (shouldRunLess()) {
      watch({pattern: globs.less()}, changed => run(
        read({pattern: changed}),
        less({
          paths: ['.', 'node_modules'],
        }),
        write({target: 'dist'}),
      ));
    }

    return [
      !shouldRunSass() ? null : run(
        read({pattern: globs.sass()}),
        sass({
          includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
        }),
        write({target: 'dist'}),
      ),
      !shouldRunLess() ? null : run(
        read({pattern: globs.less()}),
        less({
          paths: ['.', 'node_modules'],
        }),
        write({target: 'dist'}),
      )
    ].filter(a => a);
  }

  async function transpileJavascriptAndRunServer() {
    if (isTypescriptProject()) {
      await run(typescript({watch: true, project: 'tsconfig.json', rootDir: '.', outDir: './dist/'}));
      await appServer();

      return watch({pattern: [path.join('dist', '**', '*.js'), 'index.js']}, debounce(appServer, 500, {maxWait: 1000}));
    }

    if (isBabelProject()) {
      watch({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}, async changed => {
        await run(
          read({pattern: changed}),
          babel(),
          write({target: 'dist'}),
        );

        await appServer();
      });

      await run(
        read({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}),
        babel({sourceMaps: true}),
        write({target: 'dist'}),
      );

      return appServer();
    }

    watch({pattern: globs.babel()}, appServer);

    return appServer();
  }
};
