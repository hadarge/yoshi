const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

module.exports.filterNoise = comp => {
  comp.plugin('done', stats => {
    logIfAny(stats.toString({
      colors: true,
      hash: false,
      chunks: false,
      assets: false,
      children: false,
      version: false,
      timings: false,
      modules: false
    }));
    mkdirp.sync(path.resolve('target'));
    fs.writeFileSync('target/webpack-stats.json', JSON.stringify(stats.toJson()));
  });

  return comp;
};

const readDir = patterns =>
  [].concat(patterns).reduce((acc, pattern) =>
    acc.concat(glob.sync(pattern)), []);

const exists = patterns => !!readDir(patterns).length;

module.exports.shouldRunWebpack = (webpackConfig, defaultEntry, configuredEntry) => {
  const defaultEntryPath = path.join(webpackConfig.context, defaultEntry);
  return configuredEntry || exists(`${defaultEntryPath}.{js,jsx,ts,tsx}`);
};

function logIfAny(log) {
  if (log) {
    console.log(log);
  }
}


