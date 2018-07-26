const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const chokidar = require('chokidar');
const childProcess = require('child_process');
const detect = require('detect-port');
const { mergeWith } = require('lodash/fp');
const cosmiconfig = require('cosmiconfig');
const project = require('../config/project');
const globs = require('./globs');

const readDir = (module.exports.readDir = patterns =>
  []
    .concat(patterns)
    .reduce((acc, pattern) => acc.concat(glob.sync(pattern)), []));

module.exports.copyFile = (source, target) =>
  new Promise((resolve, reject) => {
    const done = err => (err ? reject(err) : resolve());

    const rd = fs.createReadStream(source).on('error', err => done(err));

    const wr = fs
      .createWriteStream(target)
      .on('error', err => done(err))
      .on('close', err => done(err));

    rd.pipe(wr);
  });

const exists = (module.exports.exists = patterns => !!readDir(patterns).length);

const tryRequire = (module.exports.tryRequire = name => {
  try {
    return require(name);
  } catch (ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw ex;
  }
});

function concatCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function logIfAny(log) {
  if (log) {
    console.log(log);
  }
}

module.exports.hasE2ETests = () => {
  return glob.sync(globs.e2e()).length > 0;
};

module.exports.noop = () => {};

module.exports.logIfAny = logIfAny;

module.exports.mergeByConcat = mergeWith(concatCustomizer);

module.exports.suffix = suffix => str => {
  const hasSuffix = str.lastIndexOf(suffix) === str.length - suffix.length;
  return hasSuffix ? str : str + suffix;
};

module.exports.isTypescriptProject = () =>
  !!tryRequire(path.resolve('tsconfig.json'));

module.exports.isBabelProject = () => {
  return !!glob.sync(path.resolve('.babelrc')).length || !!project.babel();
};

module.exports.shouldExportModule = () => {
  const pkg = tryRequire(path.resolve('package.json'));
  return !!(pkg && pkg.module);
};

module.exports.shouldRunLess = () => {
  return glob.sync(`${globs.base()}/**/*.less`).length > 0;
};

module.exports.reportWebpackStats = (stats, outputPath) => {
  logIfAny(
    stats.toString({
      colors: true,
      hash: false,
      chunks: false,
      assets: false,
      children: false,
      version: false,
      timings: false,
      modules: false,
      warningsFilter: /export .* was not found in/,
    }),
  );
  mkdirp.sync(path.resolve(path.dirname(outputPath)));
  fs.writeFileSync(outputPath, JSON.stringify(stats.toJson({ colors: false })));
};

module.exports.shouldRunSass = () => {
  return (
    glob
      .sync(`${globs.base()}/**/*.scss`)
      .filter(file => path.basename(file)[0] !== '_').length > 0
  );
};

module.exports.writeFile = (targetFileName, data) => {
  mkdirp.sync(path.dirname(targetFileName));
  fs.writeFileSync(path.resolve(targetFileName), data);
};

module.exports.watch = (
  { pattern, cwd = process.cwd(), ignoreInitial = true, ...options },
  callback,
) => {
  const watcher = chokidar
    .watch(pattern, { cwd, ignoreInitial, ...options })
    .on('all', (event, path) => callback(path));

  return watcher;
};

module.exports.isSingleEntry = entry =>
  typeof entry === 'string' || Array.isArray(entry);

module.exports.watchMode = value => {
  if (value !== undefined) {
    process.env.WIX_NODE_BUILD_WATCH_MODE = value;
  }
  return !!process.env.WIX_NODE_BUILD_WATCH_MODE;
};

module.exports.inTeamCity = () =>
  process.env.BUILD_NUMBER || process.env.TEAMCITY_VERSION;

module.exports.isProduction = () =>
  (process.env.NODE_ENV || '').toLowerCase() === 'production';

module.exports.shouldRunWebpack = webpackConfig => {
  const defaultEntryPath = path.join(
    webpackConfig.context,
    project.defaultEntry(),
  );
  return project.entry() || exists(`${defaultEntryPath}.{js,jsx,ts,tsx}`);
};

module.exports.migrateToScopedPackages = () =>
  process.env.MIGRATE_TO_SCOPED_PACKAGES === 'true';

module.exports.shouldRunStylelint = () => {
  return cosmiconfig('stylelint')
    .load()
    .then(Boolean);
};

module.exports.getMochaReporter = () => {
  if (module.exports.inTeamCity()) {
    return 'mocha-teamcity-reporter';
  }

  if (process.env.mocha_reporter) {
    return process.env.mocha_reporter;
  }

  return 'progress';
};

module.exports.hasProtractorConfigFile = () => {
  return exists(path.resolve('protractor.conf.js'));
};

module.exports.getListOfEntries = entry => {
  if (typeof entry === 'string') {
    return [path.resolve('src', entry)];
  } else if (typeof entry === 'object') {
    return Object.keys(entry).map(name => {
      const file = entry[name];
      return path.resolve('src', file);
    });
  }
  return [];
};

module.exports.shouldTransformHMRRuntime = () => {
  return project.hmr() === 'auto' && project.isReactProject();
};

function getProcessIdOnPort(port) {
  return childProcess
    .execSync(`lsof -i:${port} -P -t -sTCP:LISTEN`, { encoding: 'utf-8' })
    .split('\n')[0]
    .trim();
}

function getDirectoryOfProcessById(processId) {
  return childProcess
    .execSync(`lsof -p ${processId} | grep cwd | awk '{print $9}'`, {
      encoding: 'utf-8',
    })
    .trim();
}

module.exports.getProcessOnPort = async port => {
  const portTestResult = await detect(port);

  if (port === portTestResult) {
    return null;
  }

  try {
    const pid = getProcessIdOnPort(port);
    const cwd = getDirectoryOfProcessById(pid);

    return {
      pid,
      cwd,
    };
  } catch (e) {
    return null;
  }
};
