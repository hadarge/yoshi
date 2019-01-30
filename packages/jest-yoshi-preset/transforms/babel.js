const babelJest = require('babel-jest');
const { createBabelConfig } = require('yoshi-helpers');

const babelConfig = createBabelConfig();

module.exports = babelJest.createTransformer(babelConfig);
