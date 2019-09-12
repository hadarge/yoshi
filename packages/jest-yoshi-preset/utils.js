const project = require('yoshi-config');
const transform = require('yoshi-server-tools/jest-transform');

function withServerTransformer(transformer) {
  return {
    ...transformer,
    process(source, filename, config, transformOptions) {
      let result = source;

      if (project.yoshiServer && /\.api\.(js|tsx?)$/.test(filename)) {
        result = transform.process(source, filename);
      }

      return transformer.process(result, filename, config, transformOptions);
    },
  };
}

module.exports = {
  withServerTransformer,
};
