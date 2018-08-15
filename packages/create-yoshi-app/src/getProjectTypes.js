const path = require('path');
const globby = require('globby');

module.exports = () => {
  return globby.sync('*', {
    cwd: path.join(__dirname, '../templates'),
    onlyFiles: false,
  });
};
