const { unprocessedModules } = require('../../config/project');

module.exports = () => ({
  test: /\.js?$/,
  loader: 'ng-annotate-loader',
  include: unprocessedModules(),
});
