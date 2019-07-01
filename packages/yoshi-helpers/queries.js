const path = require('path');
const fs = require('fs');
const globby = require('globby');
const cosmiconfig = require('cosmiconfig');
const project = require('yoshi-config');
const globs = require('yoshi-config/globs');
const { tryRequire } = require('./utils');
const { POM_FILE } = require('yoshi-config/paths');
const { defaultEntry } = require('./constants');

const exists = (module.exports.exists = (patterns, options) =>
  !!globby.sync(patterns, options).length);

module.exports.isSingleEntry = entry =>
  typeof entry === 'string' || Array.isArray(entry);

module.exports.watchMode = () => {
  return !!process.env.WIX_NODE_BUILD_WATCH_MODE;
};

module.exports.inTeamCity = () =>
  process.env.BUILD_NUMBER || process.env.TEAMCITY_VERSION;

module.exports.inPRTeamCity = () =>
  module.exports.inTeamCity() && process.env.agentType === 'pullrequest';

module.exports.isProduction = () =>
  (process.env.NODE_ENV || '').toLowerCase() === 'production';

module.exports.shouldRunWebpack = webpackConfig => {
  const defaultEntryPath = path.join(webpackConfig.context, defaultEntry);
  return project.entry || exists(`${defaultEntryPath}.{js,jsx,ts,tsx}`);
};

module.exports.shouldRunStylelint = () => {
  return cosmiconfig('stylelint')
    .load()
    .then(Boolean);
};

module.exports.shouldRunSass = () => {
  return (
    globby.sync(globs.scss).filter(file => path.basename(file)[0] !== '_')
      .length > 0
  );
};

module.exports.isTypescriptProject = () =>
  fs.existsSync(path.resolve('tsconfig.json'));

module.exports.shouldExportModule = () => {
  const pkg = tryRequire(path.resolve('package.json'));
  return !!(pkg && pkg.module);
};

module.exports.shouldRunLess = () => {
  return exists(globs.less);
};

module.exports.hasE2ETests = () => {
  return exists(globs.e2eTests, { gitignore: true });
};

module.exports.hasProtractorConfigFile = () => {
  return exists(path.resolve('protractor.conf.js'));
};

module.exports.hasBundleInStaticsDir = () => {
  return globby.sync(path.resolve(globs.statics, '*.bundle.js')).length > 0;
};

module.exports.shouldDeployToCDN = () => {
  return (
    module.exports.inTeamCity() &&
    (process.env.ARTIFACT_VERSION || process.env.BUILD_VCS_NUMBER) &&
    fs.existsSync(POM_FILE)
  );
};

module.exports.isWebWorkerBundle = !!project.webWorkerEntry;
