const path = require('path');
const LoggerPlugin = require('haste-plugin-wix-logger');
const globs = require('../globs');
const projectConfig = require('../../config/project');
const {watchMode} = require('../utils');
const shouldWatch = watchMode();

module.exports = async configure => {
  if (shouldWatch) {
    return;
  }

  const {run, tasks} = configure({
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
    webpack,
    petriSpecs,
    updateNodeVersion,
    fedopsBuildReport,
    mavenStatics,
  } = tasks;

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(updateNodeVersion()),
  ]);

  await Promise.all([
    run(
      read({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}),
      babel(),
      write({target: 'dist'}),
    ),
    run(
      read({pattern: `${globs.base()}/**/*.scss`}),
      sass({
        includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
      }),
      write({target: 'dist'}),
    ),
    run(
      read({
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
          `${globs.base()}/**/*.{css,json,d.ts}`,
        ]
      }),
      write({target: 'dist'}, {title: 'copy-server-assets'}),
    ),
    run(
      read({
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
        ]
      }),
      write({base: 'src', target: 'dist/statics'}, {title: 'copy-static-assets'}),
    ),
    run(webpack({configPath: require.resolve('../../config/webpack.config.prod')}, {title: 'webpack-production'})),
    run(webpack({configPath: require.resolve('../../config/webpack.config.dev')}, {title: 'webpack-development'})),
    run(petriSpecs({config: projectConfig.petriSpecsConfig()})),
    run(
      mavenStatics({
        clientProjectName: projectConfig.clientProjectName(),
        staticsDir: projectConfig.clientFilesPath()
      })
    ),
  ]);

  await run(fedopsBuildReport());
};
