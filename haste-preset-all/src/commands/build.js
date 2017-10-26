const LoggerPlugin = require('haste-plugin-wix-logger');
const paths = require('../../config/paths');
const projectConfig = require('../../config/project');

module.exports = async configure => {
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
    mavenStatics
  } = tasks;

  await run(clean({pattern: `${paths.build}/*`}));

  await run(updateNodeVersion());

  await Promise.all([
    run(
      read({pattern: `{${paths.src},${paths.test}}/**/*.js`}),
      babel(),
      write({target: paths.build})
    ),
    run(
      read({pattern: `${paths.src}/**/*.scss`}),
      sass({
        includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
      }),
      write({target: paths.build})
    ),
    run(
      read({
        pattern: [
          `${paths.assets}/**/*.*`,
          `${paths.src}/**/*.{ejs,html,vm}`,
          `${paths.src}/**/*.{css,json,d.ts}`,
        ]
      }),
      write({target: paths.build}, {title: 'copy-server-assets'})
    ),
    run(
      read({
        pattern: [
          `${paths.assets}/**/*.*`,
          `${paths.src}/**/*.{ejs,html,vm}`,
        ]
      }),
      write({base: paths.src, target: paths.statics}, {title: 'copy-static-assets'})
    ),
    run(webpack({configPath: paths.config.webpack.production}, {title: 'webpack-production'})),
    run(webpack({configPath: paths.config.webpack.development}, {title: 'webpack-development'})),
    run(petriSpecs({config: projectConfig.petriSpecsConfig()})),
    run(
      mavenStatics({
        clientProjectName: projectConfig.clientProjectName(),
        staticsDir: projectConfig.clientFilesPath()
      })
    )
  ]);

  await run(fedopsBuildReport());
};
