const validateConfig = require('../utils/validate-config');

describe('validateConfig', () => {
  it('should not throw error if config does match schema', () => {
    const config = { someProperty: 'some string' };
    const schema = { properties: { someProperty: { type: 'string' } } };

    const validateFunc = () => validateConfig(config, schema);

    expect(validateFunc).not.toThrowError();
  });

  it('should throw error if config does not match schema', () => {
    const config = { someProperty: 'some string' };
    const schema = { properties: { someProperty: { type: 'number' } } };

    const validateFunc = () => validateConfig(config, schema);

    expect(validateFunc).toThrowError(
      /configuration\/someProperty should be a number/,
    );
  });
});
