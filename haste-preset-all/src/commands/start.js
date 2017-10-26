const path = require('path');
const LoggerPlugin = require('haste-plugin-wix-logger');
const projectConfig = require('../../config/project');
const globs = require('../globs');

module.exports = async configure => {
  const {run, watch, tasks} = configure({
    persistent: true,
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const {
    clean,
    read,
    babel,
    write,
    sass,
    server,
    petriSpecs,
    updateNodeVersion,
    fedopsBuildReport,
    mavenStatics,
    webpackDevServer,
    mocha,
  } = tasks;

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(updateNodeVersion()),
  ]);

  await Promise.all([
    run(
      read({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}),
      babel({sourceMaps: true}),
      write({target: 'dist'}),
      server({serverPath: 'index.js'}),
    ),
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
      webpackDevServer({
        configPath: require.resolve('../../config/webpack.config.dev'),
        port: projectConfig.servers.cdn.port(),
        decoratorPath: require.resolve('../server-api'),
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

  await run(
    read({pattern: globs.specs()}),
    mocha({
      requireFiles: [require.resolve('../../config/test-setup')],
      timeout: 30000,
    }),
  );

  await run(fedopsBuildReport());

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

  watch([path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], changed => run(
    read({pattern: changed}),
    babel(),
    write({target: 'dist'}),
    server({serverPath: 'index.js'}),
  ));

  watch(`${globs.base()}/**/*.scss`, changed => run(
    read({pattern: changed}),
    sass({
      includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
    }),
    write({target: 'dist'}),
  ));

  watch([globs.specs(), path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], () => run(
    read({pattern: globs.specs()}),
    mocha({timeout: 30000}),
  ));
};
