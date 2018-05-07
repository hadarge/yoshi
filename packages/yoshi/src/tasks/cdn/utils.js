const path = require('path');
const glob = require('glob');
const { isPlainObject, isString } = require('lodash');

module.exports.logStats = compiler => {
  compiler.plugin('done', stats => {
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
      }),
    );
  });

  return compiler;
};

const readDir = patterns =>
  [].concat(patterns).reduce((acc, pattern) => acc.concat(glob.sync(pattern)), []);

const exists = patterns => !!readDir(patterns).length;

module.exports.shouldRunWebpack = (webpackConfig, defaultEntry, configuredEntry) => {
  const defaultEntryPath = path.join(webpackConfig.context, defaultEntry);
  return configuredEntry || exists(`${defaultEntryPath}.{js,jsx,ts,tsx}`);
};

const normalizeEntries = entries => {
  if (isString(entries)) {
    return [entries];
  } else if (isPlainObject(entries)) {
    return Object.keys(entries).reduce((total, key) => {
      total[key] = normalizeEntries(entries[key]);
      return total;
    }, {});
  }
  return entries;
};
module.exports.normalizeEntries = normalizeEntries;

function logIfAny(log) {
  if (log) {
    console.log(log);
  }
}
