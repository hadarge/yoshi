const { unprocessedModules } = require('yoshi-config');
const threadLoader = require('./thread');

module.exports = () => ({
  test: /\.js?$/,
  use: [threadLoader(), { loader: 'babel-loader' }],
  include: unprocessedModules,
});
