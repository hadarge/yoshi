const {expect} = require('chai');
const match = require('minimatch');
const globs = require('../src/globs');

describe('glob patterns', () => {
  describe('specs', () => {
    it('matches .it.* suffix', () => {
      expect(match('test/a.it.js', globs.specs())).to.be.true;
    });

    it('matches .spec.* suffix', () => {
      expect(match('test/a.spec.js', globs.specs())).to.be.true;
    });

    it('matches jsx? extension', () => {
      expect(match('test/a.spec.js', globs.specs())).to.be.true;
      expect(match('test/a.spec.jsx', globs.specs())).to.be.true;
    });

    it('matches tsx? extension', () => {
      expect(match('test/a.spec.ts', globs.specs())).to.be.true;
      expect(match('test/a.spec.tsx', globs.specs())).to.be.true;
    });
  });
});
