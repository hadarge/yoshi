module.exports = () => ({
  test: /[\\/]node_modules[\\/]lodash/,
  loader: '@wix/externalize-relative-module-loader',
});
