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
  shouldExportModule,
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
  } = tasks;

  const migrateScopePackages = tasks[require.resolve('../tasks/migrate-to-scoped-packages')];
  const migrateBowerArtifactory = tasks[require.resolve('../tasks/migrate-bower-artifactory')];
  const wixUpdateNodeVersion = tasks[require.resolve('../tasks/update-node-version')];
  const wixPetriSpecs = tasks[require.resolve('../tasks/petri-specs')];
  const wixMavenStatics = tasks[require.resolve('../tasks/maven-statics')];
  const wixDepCheck = tasks[require.resolve('../tasks/dep-check')];

  await Promise.all([
    clean({pattern: `{dist,target}/*`}),
    wixUpdateNodeVersion({}, {title: 'update-node-version'}),
    migrateScopePackages({}, {title: 'scope-packages-migration'}),
    migrateBowerArtifactory({}, {title: 'migrate-bower-artifactory'}),
    wixDepCheck({}, {title: 'dep-check'})
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
    wixPetriSpecs({config: petriSpecsConfig()}, {title: 'petri-specs'}),
    wixMavenStatics({
      clientProjectName: clientProjectName(),
      staticsDir: clientFilesPath()
    }, {title: 'maven-statics'})
  ]);

  function bundle() {
    const configPath = require.resolve('../../config/webpack.config.client');
    const productionCallbackPath = require.resolve('../webpack-production-callback');
    const developmentCallbackPath = require.resolve('../webpack-development-callback');
    const webpackConfig = require(configPath)();

    const defaultOptions = {
      configPath
    };

    if (shouldRunWebpack(webpackConfig)) {
      return Promise.all([
        webpack({...defaultOptions, callbackPath: productionCallbackPath, configParams: {debug: false, analyze: cliArgs.analyze}}, {title: 'webpack-production'}),
        webpack({...defaultOptions, callbackPath: developmentCallbackPath, configParams: {debug: true}}, {title: 'webpack-development'})
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
      const transformOptions = {pattern: globs.babel(), target: globs.multipleModules.clientDist()};
      const babelTransformsChain = [];
      if (shouldExportModule()) {
        transformOptions.plugins = [
          require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
        ];
        babelTransformsChain.push(
          babel({pattern: globs.babel(), target: globs.esModulesDist()})
        );
      }
      return Promise.all([...babelTransformsChain, babel(transformOptions)]);
    }

    return Promise.resolve();
  }
}, {persistent: !!cliArgs.analyze});
