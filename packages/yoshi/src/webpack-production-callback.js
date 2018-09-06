const { reportWebpackStats } = require('yoshi-helpers');

module.exports = (err, stats) => {
  if (err === null) {
    reportWebpackStats('production', stats);
  }
};
