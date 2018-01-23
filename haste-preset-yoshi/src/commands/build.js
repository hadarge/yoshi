const path = require('path');
const {createRunner} = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const parseArgs = require('minimist');
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
  shouldRunWebpack,
  shouldRunLess,
  shouldRunSass,
} = require('../utils');

const runner = createRunner({
  logger: new LoggerPlugin()
});

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = runner.command(async tasks => {
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
    wixPetriSpecs,
    wixDepCheck,
    wixUpdateNodeVersion,
    wixMavenStatics,
  } = tasks;

  const migrateScopePackages = tasks[require.resolve('../tasks/migrate-to-scoped-packages/index')];
  const migrateBowerArtifactory = tasks[require.resolve('../tasks/migrate-bower-artifactory/index')];

  await Promise.all([
    clean({pattern: `{dist,target}/*`}),
    wixUpdateNodeVersion(),
    migrateScopePackages({}, {title: 'scope-packages-migration'}),
    migrateBowerArtifactory({}, {title: 'migrate-bower-artifactory'}),
    wixDepCheck()
  ]);

  await Promise.all([
    transpileJavascript().then(() => transpileNgAnnotate()),
    ...transpileCss(),
    copy({pattern: [
      `${globs.base()}/assets/**/*`,
      `${globs.base()}/**/*.{ejs,html,vm}`,
      `${globs.base()}/**/*.{css,json,d.ts}`,
    ], target: 'dist'}, {title: 'copy-server-assets'}),
    copy({pattern: [
      `${globs.assetsLegacyBase()}/assets/**/*`,
      `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
    ], target: 'dist/statics'}, {title: 'copy-static-assets-legacy'}),
    copy({
      pattern: [
        `assets/**/*`,
        `**/*.{ejs,html,vm}`,
      ],
      source: globs.assetsBase(),
      target: 'dist/statics'
    }, {title: 'copy-static-assets'}),
    bundle(),
    wixPetriSpecs({config: petriSpecsConfig()}),
    wixMavenStatics({
      clientProjectName: clientProjectName(),
      staticsDir: clientFilesPath()
    })
  ]);

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
        webpack({...defaultOptions, configParams: {debug: false, analyze: cliArgs.analyze}}, {title: 'webpack-production'}),
        webpack({...defaultOptions, configParams: {debug: true}}, {title: 'webpack-development'})
      ]);
    }

    return Promise.resolve();
  }

  function transpileCss() {
    return [
      !shouldRunSass() ? null :
        sass({
          pattern: globs.sass(),
          target: 'dist',
          options: {includePaths: ['node_modules', 'node_modules/compass-mixins/lib']}
        }),
      !shouldRunLess() ? null :
        less({
          pattern: globs.less(),
          target: 'dist',
          options: {paths: ['.', 'node_modules']},
        }),
    ].filter(a => a);
  }

  function transpileNgAnnotate() {
    if (isAngularProject()) {
      return ngAnnotate({
        glob: 'dist/' + globs.base()
      });
    }
  }

  function transpileJavascript() {
    if (isTypescriptProject() && runIndividualTranspiler()) {
      return typescript({project: 'tsconfig.json', rootDir: '.', outDir: './dist/'});
    }

    if (isBabelProject() && runIndividualTranspiler()) {
      return babel({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], target: 'dist'});
    }

    return Promise.resolve();
  }
}, {persistent: !!cliArgs.analyze});
