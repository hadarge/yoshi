import webpack from 'webpack';
import { ConcatSource } from 'webpack-sources';

export default class implements webpack.Plugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap('ExportDefaultPlugin', compilation => {
      const { mainTemplate, chunkTemplate } = compilation;

      const onRenderWithEntry = (source: string) => {
        return new ConcatSource(
          `(function (val) { return val.default || val; })(`,
          source,
          `)`,
        );
      };

      for (const template of [mainTemplate, chunkTemplate]) {
        // @ts-ignore
        template.hooks.renderWithEntry.tap(
          'ExportDefaultPlugin',
          onRenderWithEntry,
        );
      }

      // @ts-ignore
      mainTemplate.hooks.hash.tap('ExportDefaultPlugin', hash => {
        hash.update('export property');
        // @ts-ignore
        hash.update(`${this.property}`);
      });
    });
  }
}
