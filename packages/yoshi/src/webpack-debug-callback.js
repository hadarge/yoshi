const { reportWebpackStats } = require('./utils');

module.exports = (err, stats) => {
  if (err === null) {
    reportWebpackStats('debug', stats, 'target/webpack-stats.json');
  }
};
