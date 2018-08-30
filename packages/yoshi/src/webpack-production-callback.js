const { reportWebpackStats } = require('./utils');

module.exports = (err, stats) => {
  if (err === null) {
    reportWebpackStats('production', stats, 'target/webpack-stats.min.json');
  }
};
