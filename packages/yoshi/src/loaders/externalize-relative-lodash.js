module.exports = () => ({
  test: /[\\/]node_modules[\\/]lodash/,
  loader: 'externalize-relative-module-loader',
});
