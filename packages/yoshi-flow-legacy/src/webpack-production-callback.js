const { reportWebpackStats } = require('yoshi-helpers/utils');

module.exports = (err, stats) => {
  if (err === null) {
    reportWebpackStats('production', stats);
  }
};
