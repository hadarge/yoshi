module.exports = class WebpackEnvironmentMarkPlugin {
  apply() {
    process.env.IN_WEBPACK = 'true';
  }
};
