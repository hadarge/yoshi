const { unprocessedModules } = require('yoshi-config');

module.exports = () => ({
  test: /\.js?$/,
  loader: 'ng-annotate-loader',
  include: unprocessedModules,
});
