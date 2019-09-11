const babelJest = require('babel-jest');
const { createBabelConfig } = require('yoshi-helpers/utils');
const { withServerTransformer } = require('../utils');

const babelConfig = createBabelConfig();
const transformer = babelJest.createTransformer(babelConfig);

module.exports = withServerTransformer(transformer);
