const path = require('path');
const parseArgs = require('minimist');
const crossSpawn = require('cross-spawn');
const LoggerPlugin = require('haste-plugin-wix-logger');
const projectConfig = require('../../config/project');
const globs = require('../globs');
const {
  isTypescriptProject,
  isBabelProject,
  shouldRunLess,
  shouldRunSass,
  suffix
} = require('../utils');

const addJsSuffix = suffix('.js');
const cliArgs = parseArgs(process.argv.slice(2));
const entryPoint = addJsSuffix(cliArgs['entry-point'] || 'index.js');

module.exports = async configure => {
  const {run, watch, tasks} = configure({
    persistent: true,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {
    cdn,
    sass,
    less,
    read,
    clean,
    babel,
    write,
    typescript,
    petriSpecs,
    mavenStatics,
    runAppServer,
    updateNodeVersion,
  } = tasks;

  const appServer = async () => {
    if (cliArgs['no-server']) {
      return;
    }

    return run(
      runAppServer({entryPoint, manualRestart: cliArgs['manual-restart']})
    );
  };

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(updateNodeVersion()),
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
      write({target: 'dist'}, {title: 'copy-server-assets'})
    ),
    run(
      read({
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
        ]
      }),
      write({base: 'src', target: 'dist/statics'}, {title: 'copy-static-assets'})
    ),
    run(cdn({
      port: projectConfig.servers.cdn.port(),
      ssl: projectConfig.servers.cdn.ssl(),
      publicPath: projectConfig.servers.cdn.url(),
      statics: projectConfig.clientFilesPath(),
      webpackConfigPath: require.resolve('../../config/webpack.config.client'),
      configuredEntry: projectConfig.entry(),
      defaultEntry: projectConfig.defaultEntry()
    })),
    run(petriSpecs({config: projectConfig.petriSpecsConfig()})),
    run(
      mavenStatics({
        clientProjectName: projectConfig.clientProjectName(),
        staticsDir: projectConfig.clientFilesPath()
      })
    ),
  ]);

  crossSpawn('npm', ['test', '--silent'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      WIX_NODE_BUILD_WATCH_MODE: 'true'
    }
  });

  watch([
    `${globs.base()}/assets/**/*`,
    `${globs.base()}/**/*.{ejs,html,vm}`,
    `${globs.base()}/**/*.{css,json,d.ts}`,
  ], changed => run(
    read(changed),
    write({target: 'dist'}),
  ));

  watch([
    `${globs.base()}/assets/**/*`,
    `${globs.base()}/**/*.{ejs,html,vm}`,
  ], changed => run(
    read(changed),
    write({base: 'src', target: 'dist/statics'}),
  ));

  function transpileCss() {
    if (shouldRunSass) {
      watch(`${globs.base()}/**/*.scss`, changed => run(
        read({pattern: changed}),
        sass({
          includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
        }),
        write({target: 'dist'}),
      ));
    }

    if (shouldRunLess) {
      watch(`${globs.base()}/**/*.less`, changed => run(
        read({pattern: changed}),
        less({
          paths: ['.', 'node_modules'],
        }),
        write({target: 'dist'}),
      ));
    }

    return [
      !shouldRunSass ? null : run(
        read({pattern: `${globs.base()}/**/*.scss`}),
        sass({
          includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
        }),
        write({target: 'dist'}),
      ),
      !shouldRunLess ? null : run(
        read({pattern: `${globs.base()}/**/*.less`}),
        less({
          paths: ['.', 'node_modules'],
        }),
        write({target: 'dist'}),
      )
    ].filter(a => a);
  }

  async function transpileJavascriptAndRunServer() {
    if (isTypescriptProject()) {
      watch([path.join('dist', '**', '*.js'), 'index.js'], appServer);

      await run(
        typescript({watch: true, project: 'tsconfig.json', rootDir: '.', outDir: './dist/'})
      );

      return appServer();
    }

    if (isBabelProject()) {
      watch([path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], async changed => {
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

    watch(globs.babel(), appServer);

    return appServer();
  }
};
