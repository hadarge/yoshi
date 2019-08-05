const { isProduction } = require('../queries');

describe('Utils', () => {
  describe('isProduction ', () => {
    let nodeEnvCopy;

    beforeEach(() => (nodeEnvCopy = process.env.NODE_ENV));
    afterEach(() => (process.env.NODE_ENV = nodeEnvCopy));

    it('should handle upper case process.env.NODE_ENV', () => {
      process.env.NODE_ENV = 'PRODUCTION';
      expect(isProduction()).toEqual(true);
    });

    it('should not fail for empty process.env.NODE_ENV', () => {
      delete process.env.NODE_ENV;
      expect(isProduction()).toEqual(false);
    });
  });
});
