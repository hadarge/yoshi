class HtmlPolyfillPlugin {
  constructor(htmlWebpackPlugin, polyfills) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.polyfills = polyfills;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlPolyfillPlugin', compilation => {
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);

      hooks.beforeAssetTagGeneration.tap('HtmlPolyfillPlugin', ({ assets }) => {
        assets.js.unshift(...this.polyfills);
      });
    });
  }
}

module.exports = HtmlPolyfillPlugin;
