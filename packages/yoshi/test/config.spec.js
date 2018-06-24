const path = require('path');
const { expect } = require('chai');
const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');

describe('Lookup and read configuration', () => {
  let test;

  beforeEach(() => (test = tp.create()));
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
          },
        }),
      })
      .execute('build');
    expect(res.code).to.equal(0);
    expect(test.content('dist/statics/app.bundle.js')).to.contain(
      'I am entry from package',
    );
    expect(test.content('dist/statics/app.bundle.js')).to.not.contain(
      'I am entry from yoshi.config',
    );
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
        'package.json': '{}',
      })
      .execute('build');
    expect(res.code).to.equal(0);
    expect(test.content('dist/statics/app.bundle.js')).to.contain(
      'I am entry from yoshi.config',
    );
    expect(test.content('dist/statics/app.bundle.js')).to.not.contain(
      'I am entry from package',
    );
  });

  describe('extends option', () => {
    it('should allow extending the base config with defaults', () => {
      const res = test
        .setup({
          'src/app1.js': `'entry.app1';`,
          'src/app2.js': `'entry.app2';`,
          './yoshi-config-test/index.js':
            "module.exports = { defaultConfig: { entry: './app1' } }",
          'package.json': fx.packageJson({
            extends: path.join(test.tmp, 'yoshi-config-test'),
          }),
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.contain(
        'entry.app1',
      );
      expect(test.content('dist/statics/app.bundle.js')).to.not.contain(
        'entry.app2',
      );
    });

    it('should allow overriding the default configs', () => {
      const res = test
        .setup({
          'src/app1.js': `'entry.app1';`,
          'src/app2.js': `'entry.app2';`,
          './yoshi-config-test/index.js':
            "module.exports = { defaultConfig: { entry: './app1' } }",
          'package.json': fx.packageJson({
            extends: path.join(test.tmp, 'yoshi-config-test'),
            entry: './app2',
          }),
        })
        .execute('build');

      expect(res.code).to.equal(0);
      expect(test.content('dist/statics/app.bundle.js')).to.not.contain(
        'entry.app1',
      );
      expect(test.content('dist/statics/app.bundle.js')).to.contain(
        'entry.app2',
      );
    });
  });
});
