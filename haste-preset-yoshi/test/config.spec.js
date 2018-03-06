'use strict';

const {expect} = require('chai');
const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');

describe('Lookup and read configuration', () => {
  let test;

  beforeEach(() => test = tp.create());
  afterEach(() => test.teardown());

  it('should consider that package.json has higher priority than yoshi.config.js', () => {
    const res = test
    .setup({
      'src/app1.js': `'I am entry from package';`,
      'src/app2.js': `'I am entry from yoshi.config';`,
      'yoshi.config.js': `module.exports = {
        entry: {
          app: './app2.js',
        }
      };`,
      'package.json': fx.packageJson({
        entry: {
          app: './app1.js',
        }
      })
    })
    .execute('build');
    expect(res.code).to.equal(0);
    expect(test.content('dist/statics/app.bundle.js')).to.contain('I am entry from package');
    expect(test.content('dist/statics/app.bundle.js')).to.not.contain('I am entry from yoshi.config');
  });

  it('should use `yoshi.config.js` if no `yoshi` field in package.json was specified', () => {
    const res = test
    .setup({
      'src/app1.js': `'I am entry from package';`,
      'src/app2.js': `'I am entry from yoshi.config';`,
      'yoshi.config.js': `module.exports = {
        entry: {
          app: './app2.js',
        }
      };`,
      'package.json': '{}'
    })
    .execute('build');
    expect(res.code).to.equal(0);
    expect(test.content('dist/statics/app.bundle.js')).to.contain('I am entry from yoshi.config');
    expect(test.content('dist/statics/app.bundle.js')).to.not.contain('I am entry from package');
  });
});
