const { setupRequireHooks } = require('./require-hooks');
const queries = require('./queries');
const utils = require('./utils.js');

module.exports = {
  setupRequireHooks,
  ...queries,
  ...utils,
};
