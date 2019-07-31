if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = require('./build/hot.prod');
} else {
  module.exports = require('./build/hot.dev');
}
