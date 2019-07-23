import { unprocessedModules, createBabelConfig } from '../utils';

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [unprocessedModules],
  ...babelConfig,
});
