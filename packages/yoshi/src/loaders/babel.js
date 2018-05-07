const { unprocessedModules } = require('../../config/project');
const threadLoader = require('./thread');

module.exports = () => ({
  test: /\.js?$/,
  use: [threadLoader(), { loader: 'babel-loader' }],
  include: unprocessedModules(),
});
