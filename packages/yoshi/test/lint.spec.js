const { expect } = require('chai');
const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');
const { insideTeamCity } = require('./helpers/env-variables');

describe('Aggregator: Lint', () => {
  const test = tp.create();
  afterEach(() => test.teardown());

  describe('yoshi-tslint', () => {
    it('should use yoshi-tslint', () => {
      const res = test
        .setup({
          'app/a.ts': `parseInt("1", 10);`,
          'package.json': fx.packageJson(),
          'tsconfig.json': fx.tsconfig(),
          'tslint.json': fx.tslint({ radix: true }),
        })
        .execute('lint');

      expect(res.code).to.equal(0);
    });

    it('should fail with exit code 1', () => {
      const res = test
        .setup({
          'app/a.ts': `parseInt("1");`,
          'package.json': fx.packageJson(),
          'tsconfig.json': fx.tsconfig(),
          'tslint.json': fx.tslint({ radix: true }),
        })
        .execute('lint');

      expect(res.code).to.equal(1);
      expect(res.stderr).to.contain('radix  Missing radix parameter');
    });

    it('should fix linting errors and exit with exit code 0 if executed with --fix flag & there are only fixable errors', () => {
      const res = test
        .setup({
          'app/a.ts': `const a = "1"`,
          'package.json': fx.packageJson(),
          'tsconfig.json': fx.tsconfig(),
          'tslint.json': fx.tslint({ semicolon: [true, 'always'] }),
        })
        .execute('lint', ['--fix']);

      expect(res.code).to.equal(0);
      expect(test.content('app/a.ts')).to.equal(`const a = "1";`);
    });

    it('should support formatter flag', () => {
      const res = test
        .setup({
          'app/a.ts': `parseInt("1");`,
          'package.json': fx.packageJson(),
          'tsconfig.json': fx.tsconfig(),
          'tslint.json': fx.tslint({ radix: true }),
        })
        .execute('lint', ['--format json']);

      expect(res.code).to.equal(1);
      expect(JSON.parse(res.stderr)[0].failure).to.eq(
        'Missing radix parameter',
      );
    });

    it('should support a list of files to run lint on', () => {
      const res = test
        .setup({
          'app/a.ts': `parseInt("1");`,
          'app/b.tsx': `parseInt("1");`,
          'app/dontrunonme.js': `parseInt("1");`,
          'package.json': fx.packageJson(),
          'tsconfig.json': fx.tsconfig(),
          'tslint.json': fx.tslint({ radix: true }),
        })
        .execute(
          'lint',
          ['--format json', 'app/a.ts', 'app/b.tsx'],
          insideTeamCity,
        );

      const stderr = JSON.parse(res.stderr);
      expect(res.code).to.equal(1);
      expect(stderr[0].name).to.contain('app/a.ts');
      expect(stderr[0].failure).to.eq('Missing radix parameter');
      expect(stderr[1].name).to.contain('app/b.tsx');
      expect(stderr[1].failure).to.eq('Missing radix parameter');
      expect(stderr.length).to.equal(2);
    });
  });

  describe('yoshi-eslint', () => {
    function setup(data) {
      return test.setup(
        Object.assign(
          {
            'package.json': fx.packageJson(),
            '.eslintrc': fx.eslintrc(),
          },
          data,
        ),
      );
    }

    it('should use yoshi-eslint', () => {
      const res = setup({ 'app/a.js': `parseInt("1", 10);` }).execute(
        'lint',
        [],
        insideTeamCity,
      );
      expect(res.code).to.equal(0);
    });

    it('should fail with exit code 1', () => {
      const res = setup({ 'app/a.js': `parseInt("1");` }).execute(
        'lint',
        [],
        insideTeamCity,
      );
      expect(res.code).to.equal(1);
      expect(res.stderr).to.contain(
        '1:1  error  Missing radix parameter  radix',
      );
    });

    it('should fix linting errors and exit with exit code 0 if there are only fixable errors', () => {
      const res = setup({
        'app/a.js':
          '/*eslint no-regex-spaces: "error"*/\nnew RegExp("foo  bar");',
      }).execute('lint', ['--fix']);

      expect(res.code).to.equal(0);
      expect(test.content('app/a.js')).to.equal(
        '/*eslint no-regex-spaces: "error"*/\nnew RegExp("foo {2}bar");',
      );
    });

    it('should support formatter flag', () => {
      const res = setup({ 'app/a.js': `parseInt("1");` }).execute(
        'lint',
        ['--format json'],
        insideTeamCity,
      );
      expect(res.code).to.equal(1);
      expect(JSON.parse(res.stderr)[0].messages[0].message).to.eq(
        'Missing radix parameter.',
      );
    });

    it('should support a list of files to run lint on', () => {
      const res = setup({
        'app/a.js': `parseInt("1");`,
        'app/b.js': `parseInt("1");`,
        'app/dontrunonme.js': `parseInt("1");`,
      }).execute(
        'lint',
        ['--format json', 'app/a.js', 'app/b.js'],
        insideTeamCity,
      );

      const stderr = JSON.parse(res.stderr);
      expect(res.code).to.equal(1);
      expect(stderr[0].filePath).to.contain('app/a.js');
      expect(stderr[0].messages[0].message).to.eq('Missing radix parameter.');
      expect(stderr[1].filePath).to.contain('app/b.js');
      expect(stderr[1].messages[0].message).to.eq('Missing radix parameter.');
      expect(stderr.length).to.equal(2);
    });
  });

  describe('yoshi-stylelint', () => {
    it('should use yoshi-stylelint', () => {
      const goodStyle = `
p {
  $color: #ff0;
  color: #ff0;
}`;
      const res = test
        .setup({
          'src/a.scss': goodStyle,
          'src/b.scss': goodStyle,
          'a.less': goodStyle,
          'package.json': `{
            "name": "a",\n
            "version": "1.0.0",\n
            "stylelint": {
              "rules": {
                "max-empty-lines": 1
              }
            }
          }`,
        })
        .execute('lint', []);

      expect(res.stdout).to.contain(`Starting 'stylelint'`);
      expect(res.stdout).to.contain(`Finished 'stylelint'`);
      expect(res.code).to.equal(0);
    });

    it('should fail with exit code 1', () => {
      const badStyle = `
p {
  color: #ff0;
}



`;

      const res = test
        .setup({
          'src/a.scss': badStyle,
          'src/b.scss': badStyle,
          'package.json': `{
            "name": "a",\n
            "version": "1.0.0",\n
            "stylelint": {
              "rules": {
                "max-empty-lines": 1
              }
            }
          }`,
        })
        .execute('lint', []);

      expect(res.stderr).to.contain('✖  Expected no more than 1 empty line');
      expect(res.stderr).to.contain('max-empty-lines');
      expect(res.code).to.equal(1);
    });

    it('should support a list of files to run stylelint on', () => {
      const badStyle = `
p {
  color: #ff0;
}



`;
      const res = test
        .setup({
          'src/a.less': badStyle,
          'src/b.scss': badStyle,
          'src/dontrunonme.scss': badStyle,
          'package.json': `{
            "name": "a",\n
            "version": "1.0.0",\n
            "stylelint": {
              "rules": {
                "max-empty-lines": 1
              }
            }
          }`,
        })
        .execute('lint', ['src/a.less', 'src/b.scss']);

      expect(res.stderr).to.contain('✖  Expected no more than 1 empty line');
      expect(res.stderr).to.contain('src/a.less');
      expect(res.stderr).to.contain('src/b.scss');
      expect(res.stderr).to.not.contain('src/dontrunonme.scss');
      expect(res.code).to.equal(1);
    });
  });

  describe('Empty state', () => {
    it('should pass out of the box if no relevant files exist', () => {
      const res = test
        .setup({
          'package.json': fx.packageJson(),
        })
        .execute('lint');

      expect(res.code).to.equal(0);
    });
  });
});
