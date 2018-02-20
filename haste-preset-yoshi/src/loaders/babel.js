const {unprocessedModules} = require('../../config/project');

module.exports = () => ({
  test: /\.js?$/,
  loader: 'babel-loader', // 'happypack/loader?id=js',
  include: unprocessedModules()
});
