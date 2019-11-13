const StylableWebpackPlugin = require('@stylable/webpack-plugin');
const {
  createClientWebpackConfig,
  getStyleLoaders,
} = require('yoshi-flow-legacy/config/webpack.config.js');

const styleLoaders = getStyleLoaders({
  embedCss: true,
  isDebug: true,
  separateCss: false,
  isHmr: false,
  tpaStyle: false,
});

module.exports = config => {
  const webpackClientConfig = createClientWebpackConfig({
    isDebug: true,
    includeStyleLoaders: false,
  });

  config.resolve.extensions = [
    ...config.resolve.extensions,
    ...webpackClientConfig.resolve.extensions,
  ];

  config.module.rules = [
    ...webpackClientConfig.module.rules,

    // Rules for Style Sheets
    ...styleLoaders,
  ];

  config.plugins = [...(config.plugins || []), new StylableWebpackPlugin()];

  config.node = { ...webpackClientConfig.node, ...config.node };

  return config;
};
