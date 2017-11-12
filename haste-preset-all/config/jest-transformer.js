const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  plugins: [
    require.resolve('babel-plugin-transform-es2015-modules-commonjs')
  ]
});
