const path = require('path');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const parseArgs = require('minimist');
const globs = require('../globs');
const {
  runIndividualTranspiler,
  petriSpecsConfig,
  clientProjectName,
  clientFilesPath,
} = require('../../config/project');
const {
  watchMode,
  isTypescriptProject,
  isBabelProject,
  shouldRunWebpack,
  inTeamCity,
  shouldRunLess,
  shouldRunSass,
} = require('../utils');

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = async configure => {
  if (shouldWatch) {
    return;
  }

  const {run, tasks} = configure({
    plugins: [
      new LoggerPlugin(),
    ],
    persistent: !!cliArgs.analyze,
  });

  const {
    less,
    clean,
    read,
    copy,
    babel,
    write,
    sass,
    webpack,
    typescript,
    wixPetriSpecs,
    wixDepCheck,
    wixUpdateNodeVersion,
    wixFedopsBuildReport,
    wixMavenStatics,
  } = tasks;

  await Promise.all([
    run(clean({pattern: `{dist,target}/*`})),
    run(wixUpdateNodeVersion()),
    run({task: require.resolve('../tasks/migrate-to-scoped-packages/index')}),
    run(wixDepCheck())
  ]);

  await Promise.all([
    transpileJavascript(),
    ...transpileCss(),
    run(
      read({
        pattern: [
          `${globs.base()}/assets/**/*`,
          `${globs.base()}/**/*.{ejs,html,vm}`,
          `${globs.base()}/**/*.{css,json,d.ts}`,
        ]
      }),
      copy({target: 'dist'}, {title: 'copy-server-assets'}),
    ),
    run(
      read({
        pattern: [
          `${globs.assetsLegacyBase()}/assets/**/*`,
          `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
        ]
      }),
      copy({target: 'dist/statics'}, {title: 'copy-static-assets-legacy'}),
    ),
    run(
      read({
        pattern: [
          `assets/**/*`,
          `**/*.{ejs,html,vm}`,
        ],
        options: {cwd: path.resolve(globs.assetsBase())}
      }),
      copy({target: 'dist/statics'}, {title: 'copy-static-assets'}),
    ),
    bundle(),
    run(wixPetriSpecs({config: petriSpecsConfig()})),
    run(
      wixMavenStatics({
        clientProjectName: clientProjectName(),
        staticsDir: clientFilesPath()
      })
    ),
  ]);

  if (inTeamCity()) {
    await run(wixFedopsBuildReport());
  }

  function bundle() {
    const configPath = require.resolve('../../config/webpack.config.client');
    const callbackPath = require.resolve('../webpack-callback');
    const webpackConfig = require(configPath)();

    const defaultOptions = {
      configPath,
      callbackPath,
    };

    if (shouldRunWebpack(webpackConfig)) {
      return Promise.all([
        run(
          webpack({...defaultOptions, configParams: {debug: false, analyze: cliArgs.analyze}}, {title: 'webpack-production'})
        ),
        run(
          webpack({...defaultOptions, configParams: {debug: true}}, {title: 'webpack-development'})
        ),
      ]);
    }

    return Promise.resolve();
  }

  function transpileCss() {
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

  function transpileJavascript() {
    if (isTypescriptProject() && runIndividualTranspiler()) {
      return run(
        typescript({project: 'tsconfig.json', rootDir: '.', outDir: './dist/'})
      );
    }

    if (isBabelProject() && runIndividualTranspiler()) {
      return run(
        read({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js']}),
        babel(),
        write({target: 'dist'}),
      );
    }

    return Promise.resolve();
  }
};
