const {filterNoise} = require('./utils');

module.exports = (err, stats) => {
  if (err === null) {
    filterNoise(stats);
  }
};
