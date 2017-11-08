const path = require('path');
const crossSpawn = require('cross-spawn');
const LoggerPlugin = require('haste-plugin-wix-logger');
const projectConfig = require('../../config/project');
const globs = require('../globs');
const {isTypescriptProject, isBabelProject} = require('../utils');

module.exports = async (configure, {entryPoint}) => {
  const {run, watch, tasks} = configure({
    persistent: true,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {
    sass,
    read,
    clean,
    babel,
    write,
    express,
    typescript,
    petriSpecs,
    mavenStatics,
    runAppServer,
    updateNodeVersion,
  } = tasks;

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(updateNodeVersion()),
  ]);

  await Promise.all([
    transpileJavascriptAndRunServer(),
    run(
      read({pattern: `${globs.base()}/**/*.scss`}),
      sass({
        includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
      }),
      write({target: 'dist'})
    ),
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
    run(
      express({
        port: projectConfig.servers.cdn.port(),
        callbackPath: require.resolve('../server-callback'),
      }),
    ),
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

  watch(`${globs.base()}/**/*.scss`, changed => run(
    read({pattern: changed}),
    sass({
      includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
    }),
    write({target: 'dist'}),
  ));

  function transpileJavascriptAndRunServer() {
    if (isTypescriptProject()) {
      watch([path.join('dist', '**', '*.js'), 'index.js'], () => {
        return run(runAppServer({entryPoint}));
      });

      return run(
        typescript({watch: true, project: 'tsconfig.json', rootDir: '.', outDir: './dist/'}),
        runAppServer({entryPoint})
      );
    }

    if (isBabelProject()) {
      watch([path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], changed => run(
        read({pattern: changed}),
        babel(),
        write({target: 'dist'}),
        runAppServer({entryPoint}),
      ));

      return run(
        read({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}),
        babel({sourceMaps: true}),
        write({target: 'dist'}),
        runAppServer({entryPoint}),
      );
    }

    return Promise.resolve();
  }
};
