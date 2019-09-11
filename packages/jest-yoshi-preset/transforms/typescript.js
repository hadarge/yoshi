const { createTransformer } = require('ts-jest');
const { withServerTransformer } = require('../utils');

const transformer = createTransformer();

module.exports = withServerTransformer(transformer);
