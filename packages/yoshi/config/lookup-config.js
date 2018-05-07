const cosmiconfig = require('cosmiconfig');
const get = require('lodash/get');

const explorer = cosmiconfig('yoshi', {
  rc: false,
  sync: true
});

module.exports = () => get(explorer.load(), 'config', {});
