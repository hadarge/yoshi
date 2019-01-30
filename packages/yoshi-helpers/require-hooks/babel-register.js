const { unprocessedModules } = require('yoshi-config');
const { createBabelConfig } = require('../index');

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [unprocessedModules],
  ...babelConfig,
});
