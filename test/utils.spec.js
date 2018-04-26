const expect = require('chai').expect;
const {isProduction, getTsconfigPath, getTslintPath} = require('../src/utils');
const fs = require('fs');
const path = require('path');

describe('Utils', () => {
  describe('isProduction ', () => {
    let nodeEnvCopy;
    beforeEach(() => nodeEnvCopy = process.env.NODE_ENV);
    afterEach(() => process.env.NODE_ENV = nodeEnvCopy);

    it('should handle upper case process.env.NODE_ENV', () => {
      process.env.NODE_ENV = 'PRODUCTION';
      expect(isProduction()).to.equal(true);
    });

    it('should not fail for empty process.env.NODE_ENV', () => {
      delete process.env.NODE_ENV;
      expect(isProduction()).to.equal(false);
    });
  });

  describe('getTsconfigPath', () => {
    it('should return "" when there is no tsconfig.json file', () => {
      expect(getTsconfigPath()).to.equal('');
    });

    it('should return the tsconfig file path when the tsconfig.json file exists', () => {
      fs.writeFileSync('tsconfig.json');
      expect(getTsconfigPath()).to.equal(path.resolve('tsconfig.json'));
      fs.unlinkSync('tsconfig.json');
    });
  });

  describe('getTslintPath', () => {
    it('should return "" when there is no tslint.json file', () => {
      expect(getTslintPath()).to.equal('');
    });

    it('should return the tslint file path when the tslint.json file exists', () => {
      fs.writeFileSync('tslint.json');
      expect(getTslintPath()).to.equal(path.resolve('tslint.json'));
      fs.unlinkSync('tslint.json');
    });
  });
});
