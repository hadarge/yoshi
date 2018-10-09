if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = require('./hot.prod');
} else {
  module.exports = require('./hot.dev');
}
