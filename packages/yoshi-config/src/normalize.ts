import { PackageJson } from 'read-pkg';
import { Config, InitialConfig } from './config';
import { multipleModules, singleModule } from './globs';
import { getFrom } from './utils';

export default (initialConfig: InitialConfig, pkgJson: PackageJson): Config => {
  const get = getFrom(initialConfig);

  const {
    name,
    unpkg,
    dependencies = {},
    peerDependencies = {},
    jest = {},
  } = pkgJson;

  const cdnPort = get(c => c.servers.cdn.port, 3200);
  const cdnSsl = get(c => c.servers.cdn.ssl, false);
  const cdnUrl = get(
    c => c.servers.cdn.url,
    `${cdnSsl ? 'https:' : 'http:'}//localhost:${cdnPort}/`,
  );

  const clientProjectName = get(c => c.clientProjectName, undefined);
  const singleDir = get(c => c.servers.cdn.dir, singleModule.clientDist);
  const multiDir = get(c => c.servers.cdn.dir, multipleModules.clientDist);

  const clientFilesPath = clientProjectName
    ? `node_modules/${clientProjectName}/${multiDir}`
    : singleDir;

  const config: Config = {
    name,
    unpkg,

    servers: {
      cdn: {
        port: cdnPort,
        ssl: cdnSsl,
        url: cdnUrl,
      },
    },

    specs: get(c => c.specs, {}),
    hooks: get(c => c.hooks, {}),
    hmr: get(c => c.hmr, true),
    liveReload: get(c => c.liveReload, true),
    exports: get(c => c.exports, undefined),
    entry: get(c => c.entry, undefined),
    splitChunks: get(c => c.splitChunks, false),
    separateCss: get(c => c.separateCss, true),
    cssModules: get(c => c.cssModules, true),
    tpaStyle: get(c => c.tpaStyle, false),
    enhancedTpaStyle: get(c => c.enhancedTpaStyle, false),
    features: get(c => c.features, {}),
    externals: get(c => c.externals, []),
    transpileTests: get(c => c.transpileTests, true),
    externalUnprocessedModules: get(c => c.externalUnprocessedModules, []),
    petriSpecsConfig: get(c => c.petriSpecs, {}),
    performanceBudget: get(c => c.performance, false),
    resolveAlias: get(c => c.resolveAlias, {}),
    startUrl: get(c => c.startUrl, null),
    keepFunctionNames: get(c => c.keepFunctionNames, false),
    umdNamedDefine: get(c => c.umdNamedDefine, true),
    experimentalBuildHtml: get(c => c.experimentalBuildHtml, false),
    experimentalMonorepo: get(c => c.experimentalMonorepo, false),
    experimentalMinimalPRBuild: get(c => c.experimentalBuildHtml, false),
    experimentalRtlCss: get(c => c.experimentalRtlCss, false),
    projectType: get(c => c.projectType, null),
    webWorkerEntry: get(c => c.webWorker.entry, undefined),
    webWorkerExternals: get(c => c.webWorker.externals, undefined),

    jestConfig: jest,

    clientProjectName,
    clientFilesPath,

    experimentalMonorepoSubProcess:
      process.env.EXPERIMENTAL_MONOREPO_SUB_PROCESS === 'true',

    isAngularProject: !!dependencies.angular || !!peerDependencies.angular,
    isReactProject: !!dependencies.react || !!peerDependencies.react,
  };

  return config;
};
