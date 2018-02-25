const {unprocessedModules} = require('../../config/project');
const threadLoader = require('./thread');

module.exports = () => ({
  test: /\.js?$/,
  use: [
    threadLoader(),
    'babel-loader',
  ],
  include: unprocessedModules()
});
