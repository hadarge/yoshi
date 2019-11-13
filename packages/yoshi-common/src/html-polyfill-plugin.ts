import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default class HtmlPolyfillPlugin implements webpack.Plugin {
  private htmlWebpackPlugin: HtmlWebpackPlugin;
  private polyfills: Array<string>;

  constructor(htmlWebpackPlugin: HtmlWebpackPlugin, polyfills: Array<string>) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.polyfills = polyfills;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('HtmlPolyfillPlugin', compilation => {
      // @ts-ignore
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);

      hooks.beforeAssetTagGeneration.tap(
        'HtmlPolyfillPlugin',
        ({ assets }: any) => {
          assets.js.unshift(...this.polyfills);
        },
      );
    });
  }
}

module.exports = HtmlPolyfillPlugin;
