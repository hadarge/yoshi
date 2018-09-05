const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const chokidar = require('chokidar');
const chalk = require('chalk');
const childProcess = require('child_process');
const detect = require('detect-port');
const { mergeWith } = require('lodash/fp');
const project = require('yoshi-config');
const queries = require('./queries');

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

module.exports.noop = () => {};

module.exports.logIfAny = logIfAny;

module.exports.mergeByConcat = mergeWith(concatCustomizer);

module.exports.suffix = suffix => str => {
  const hasSuffix = str.lastIndexOf(suffix) === str.length - suffix.length;
  return hasSuffix ? str : str + suffix;
};

module.exports.reportWebpackStats = (buildType, stats, outputPath) => {
  console.log(chalk.magenta(`Webpack summary for ${buildType} build:`));
  logIfAny(
    stats.toString({
      colors: true,
      hash: false,
      chunks: false,
      assets: true,
      children: false,
      version: false,
      timings: false,
      modules: false,
      entrypoints: false,
      warningsFilter: /export .* was not found in/,
      builtAt: false,
    }),
  );
  mkdirp.sync(path.resolve(path.dirname(outputPath)));
  fs.writeFileSync(outputPath, JSON.stringify(stats.toJson({ colors: false })));
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

module.exports.getMochaReporter = () => {
  if (queries.inTeamCity()) {
    return 'mocha-teamcity-reporter';
  }

  if (process.env.mocha_reporter) {
    return process.env.mocha_reporter;
  }

  return 'progress';
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
  return project.hmr === 'auto' && project.isReactProject;
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

module.exports.toIdentifier = str => {
  const IDENTIFIER_NAME_REPLACE_REGEX = /^([^a-zA-Z$_])/;
  const IDENTIFIER_ALPHA_NUMERIC_NAME_REPLACE_REGEX = /[^a-zA-Z0-9$]+/g;

  if (typeof str !== 'string') return '';
  return str
    .replace(IDENTIFIER_NAME_REPLACE_REGEX, '_$1')
    .replace(IDENTIFIER_ALPHA_NUMERIC_NAME_REPLACE_REGEX, '_');
};

module.exports.tryRequire = name => {
  try {
    return require(name);
  } catch (ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw ex;
  }
};
