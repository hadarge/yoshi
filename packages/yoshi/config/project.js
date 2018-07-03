const path = require('path');
const _ = require('lodash');
const globs = require('../src/globs');
const packagejson = require('./get-project-pkg');
const lookupConfig = require('./lookup-config');

// Search for yoshi configuration from the file system.
const config = lookupConfig();

// Get configuration from the cache.
const getConfig = (key, defaultVal = false) => {
  return _.get(config, key, defaultVal);
};

const externalUnprocessedModules = ['wix-style-react/src'].concat(
  getConfig('externalUnprocessedModules', []),
);

const allSourcesButExternalModules = function(filePath) {
  filePath = path.normalize(filePath);
  return (
    filePath.startsWith(process.cwd()) && !filePath.includes('node_modules')
  );
};

module.exports = {
  name: () => packagejson.name,
  specs: {
    node: () => getConfig('specs.node'),
    browser: () => getConfig('specs.browser'),
  },
  hmr: () => getConfig('hmr', true),
  liveReload: () => getConfig('liveReload', true),
  exports: () => getConfig('exports'),
  clientProjectName: () => getConfig('clientProjectName'),
  clientFilesPath: () => {
    const clientProjectName = getConfig('clientProjectName');
    const dir = getConfig('servers.cdn.dir');
    return clientProjectName
      ? `node_modules/${clientProjectName}/${dir ||
          globs.multipleModules.clientDist()}`
      : dir || globs.singleModule.clientDist();
  },
  isUniversalProject: () => getConfig('universalProject'),
  isAngularProject: () =>
    !!_.get(packagejson, 'dependencies.angular', false) ||
    !!_.get(packagejson, 'peerDependencies.angular', false),
  isReactProject: () =>
    !!_.get(packagejson, 'dependencies.react', false) ||
    !!_.get(packagejson, 'peerDependencies.react', false),
  isEsModule: () => !!_.get(packagejson, 'module', false),
  servers: {
    cdn: {
      port: () => getConfig('servers.cdn.port', 3200),
      url: ssl =>
        getConfig(
          'servers.cdn.url',
          `${serverProtocol(
            ssl,
          )}//localhost:${module.exports.servers.cdn.port()}/`,
        ),
      ssl: () => getConfig('servers.cdn.ssl', false),
    },
  },
  entry: () => getConfig('entry'),
  splitChunks: () => getConfig('splitChunks', false),
  defaultEntry: () => './client',
  separateCss: () => getConfig('separateCss', true),
  cssModules: () => getConfig('cssModules', true),
  tpaStyle: () => getConfig('tpaStyle', false),
  features: () => getConfig('features', {}),
  externals: () => getConfig('externals', []),
  babel: () => _.get(packagejson, 'babel'),
  runIndividualTranspiler: () => getConfig('runIndividualTranspiler', true),
  unprocessedModules: () => path => {
    const externalRegexList = externalUnprocessedModules.map(
      m => new RegExp(`node_modules/${m}`),
    );

    return (
      externalRegexList.some(regex => regex.test(path)) ||
      allSourcesButExternalModules(path)
    );
  },
  jestConfig: () => _.get(packagejson, 'jest', {}),
  petriSpecsConfig: () => getConfig('petriSpecs', {}),
  performanceBudget: () => getConfig('performance', {}),
  resolveAlias: () => getConfig('resolveAlias', {}),
};

function serverProtocol(ssl) {
  return ssl ? 'https:' : 'http:';
}
