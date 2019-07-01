const { unprocessedModules, createBabelConfig } = require('../utils');

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [unprocessedModules],
  ...babelConfig,
});
