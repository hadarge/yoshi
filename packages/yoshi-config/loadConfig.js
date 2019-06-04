const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const globs = require('./globs');
const { MONOREPO_ROOT } = require('./paths');
const packagejson = require('./utils/get-project-pkg');
const lookupConfig = require('./utils/lookup-config');
const validateConfig = require('./utils/validate-config');
const YoshiOptionsValidationError = require('./utils/YoshiOptionsValidationError');
const schema = require('./schema/yoshi-config-schema');

let _config;

const loadConfig = ({ validate, useCache } = { validate: false }) => {
  let loadedConfig;

  if (!useCache) {
    loadedConfig = lookupConfig();
  } else {
    loadedConfig = _config || lookupConfig();
    _config = loadedConfig;
  }

  if (validate) {
    try {
      validateConfig(loadedConfig, schema);
    } catch (err) {
      if (err instanceof YoshiOptionsValidationError) {
        console.warn(chalk.yellow('Warning: ' + err.message));
      } else {
        throw err;
      }
    }
  }

  const getConfig = (key, defaultVal = false) => {
    return _.get(loadedConfig, key, defaultVal);
  };

  const cdnPort = getConfig('servers.cdn.port', 3200);
  const cdnSSL = getConfig('servers.cdn.ssl', false);
  const defaultCdnUrl = `${cdnSSL ? 'https:' : 'http:'}//localhost:${cdnPort}/`;
  const cdnUrl = getConfig('servers.cdn.url', defaultCdnUrl);

  const projectConfig = {
    name: packagejson.name,
    unpkg: packagejson.unpkg,
    specs: {
      node: getConfig('specs.node'),
      browser: getConfig('specs.browser'),
    },
    hooks: getConfig('hooks', {}),
    hmr: getConfig('hmr', true),
    liveReload: getConfig('liveReload', true),
    exports: getConfig('exports'),
    clientProjectName: getConfig('clientProjectName'),
    clientFilesPath: (() => {
      const clientProjectName = getConfig('clientProjectName');
      const dir = getConfig('servers.cdn.dir');

      return clientProjectName
        ? `node_modules/${clientProjectName}/${dir ||
            globs.multipleModules.clientDist}`
        : dir || globs.singleModule.clientDist;
    })(),
    isAngularProject:
      !!_.get(packagejson, 'dependencies.angular', false) ||
      !!_.get(packagejson, 'peerDependencies.angular', false),
    isReactProject:
      !!_.get(packagejson, 'dependencies.react', false) ||
      !!_.get(packagejson, 'peerDependencies.react', false),
    servers: {
      cdn: {
        port: cdnPort,
        url: cdnUrl,
        ssl: cdnSSL,
      },
    },
    entry: getConfig('entry'),
    splitChunks: getConfig('splitChunks', false),
    defaultEntry: './client',
    separateCss: getConfig('separateCss', true),
    cssModules: getConfig('cssModules', true),
    tpaStyle: getConfig('tpaStyle', false),
    enhancedTpaStyle: getConfig('enhancedTpaStyle', false),
    features: getConfig('features', {}),
    externals: getConfig('externals', []),
    transpileTests: getConfig('transpileTests', true),
    jestConfig: _.get(packagejson, 'jest', {}),
    petriSpecsConfig: getConfig('petriSpecs', {}),
    performanceBudget: getConfig('performance'),
    resolveAlias: getConfig('resolveAlias', {}),
    startUrl: getConfig('startUrl', null),
    keepFunctionNames: getConfig('keepFunctionNames', false),
    umdNamedDefine: getConfig('umdNamedDefine', true),
    experimentalBuildHtml: getConfig('experimentalBuildHtml'),
    experimentalMonorepo: getConfig('experimentalMonorepo'),
    experimentalMonorepoSubProcess:
      process.env.EXPERIMENTAL_MONOREPO_SUB_PROCESS === 'true',
    projectType: getConfig('projectType', null),
    unprocessedModules: p => {
      const allSourcesButExternalModules = function(filePath) {
        filePath = path.normalize(filePath);

        if (projectConfig.experimentalMonorepoSubProcess) {
          return (
            filePath.startsWith(MONOREPO_ROOT) &&
            !filePath.includes('node_modules')
          );
        }

        return (
          filePath.startsWith(process.cwd()) &&
          !filePath.includes('node_modules')
        );
      };

      const externalUnprocessedModules = ['wix-style-react/src'].concat(
        getConfig('externalUnprocessedModules', []),
      );

      const externalRegexList = externalUnprocessedModules.map(
        m => new RegExp(`node_modules/${m}`),
      );

      return (
        externalRegexList.some(regex => regex.test(p)) ||
        allSourcesButExternalModules(p)
      );
    },
  };

  return projectConfig;
};

module.exports = loadConfig;
