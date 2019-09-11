const { ConcatSource } = require('webpack-sources');

class ExportDefaultPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('ExportDefaultPlugin', compilation => {
      const { mainTemplate, chunkTemplate } = compilation;

      const onRenderWithEntry = source => {
        return new ConcatSource(
          `(function (val) { return val.default || val; })(`,
          source,
          `)`,
        );
      };

      for (const template of [mainTemplate, chunkTemplate]) {
        template.hooks.renderWithEntry.tap(
          'ExportDefaultPlugin',
          onRenderWithEntry,
        );
      }

      mainTemplate.hooks.hash.tap('ExportDefaultPlugin', hash => {
        hash.update('export property');
        hash.update(`${this.property}`);
      });
    });
  }
}

module.exports = ExportDefaultPlugin;
