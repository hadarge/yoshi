const { unprocessedModules } = require('yoshi-config');
const { createBabelConfig } = require('../utils');

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [unprocessedModules],
  ...babelConfig,
});
