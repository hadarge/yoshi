const Ajv = require('ajv');
const schema = require('./yoshi-config-schema.json');
const YoshiOptionsValidationError = require('./YoshiOptionsValidationError');
const ajvKeywords = require('ajv-keywords');

module.exports = config => {
  const ajv = new Ajv({ jsonPointers: true, verbose: true, allErrors: true });
  ajvKeywords(ajv, ['instanceof']);
  const valid = ajv.validate(schema, config);
  if (!valid) {
    throw new YoshiOptionsValidationError(ajv.errors);
  }
  return valid;
};
