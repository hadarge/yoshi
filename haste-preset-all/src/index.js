const build = require('./commands/build');
const start = require('./commands/start');
const lint = require('./commands/lint');
const test = require('./commands/test');
const release = require('./commands/release');

module.exports = {
  build,
  start,
  lint,
  test,
  release,
};
