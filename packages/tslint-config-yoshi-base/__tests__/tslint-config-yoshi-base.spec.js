const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { Linter, Configuration } = require('tslint');

const program = Linter.createProgram(path.join(__dirname, 'tsconfig.json'));

function runLint(filename) {
  const linter = new Linter({}, program);
  const { results } = Configuration.findConfiguration(
    require.resolve('../index.js'),
    filename,
  );

  linter.lint(filename, fs.readFileSync(filename, 'utf8'), results);

  return linter.getResult();
}

const rulesDir = path.join(__dirname, './rules');

const rules = fs.readdirSync(rulesDir);

describe('tslint-config-yoshi-base', () => {
  rules.forEach(ruleName => {
    const find = pattern => {
      return glob.sync(path.join(rulesDir, ruleName, pattern));
    };

    describe(ruleName, () => {
      const validFiles = find('valid*.ts');

      validFiles.forEach(filename => {
        const basename = path.relative(path.join(__dirname, '..'), filename);

        it(`should be valid for ${basename}`, () => {
          const result = runLint(filename);
          const failingRules = result.failures.map(({ ruleName }) => ruleName);

          expect(failingRules).toEqual([]);
        });
      });

      const invalidFiles = find('invalid*.ts');

      invalidFiles.forEach(filename => {
        const basename = path.relative(path.join(__dirname, '..'), filename);

        it(`should be invalid for ${basename}`, async () => {
          const result = runLint(filename);
          const failingRules = result.failures.map(({ ruleName }) => ruleName);

          expect(failingRules).toEqual([ruleName]);
        });
      });
    });
  });
});
