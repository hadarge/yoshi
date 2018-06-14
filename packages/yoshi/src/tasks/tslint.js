const fs = require('fs');
const path = require('path');
const globby = require('globby');
const chalk = require('chalk');

function format(options, fileFailures) {
  const { findFormatter } = require('tslint');

  const formatterName =
    options.formatter !== undefined ? options.formatter : 'prose';

  const Formatter = findFormatter(formatterName, options.formattersDirectory);

  if (Formatter === undefined) {
    throw new Error(`formatter '${formatterName}' not found`);
  }

  const formatter = new Formatter();
  const output = formatter.format(fileFailures);

  return output;
}

function runLinter({ options, tslintFilePath, tsconfigFilePath, filesPaths }) {
  // not all of our users have typescript installed.
  // tslint requires typescript to exist in node_modules when imported,
  // that should happen only when runLinter function is called in oppose to upon import
  const { Linter, Configuration } = require('tslint');

  let linter;
  let files;

  if (filesPaths) {
    // files mode
    linter = new Linter(options);
    files = filesPaths.map(fileName => ({
      fileName,
      fileContents: fs.readFileSync(path.resolve(fileName), 'utf-8'),
    }));
  } else {
    // tsconfig mode
    const program = Linter.createProgram(tsconfigFilePath);
    linter = new Linter(options, program);
    files = Linter.getFileNames(program).map(fileName => ({
      fileName,
      fileContents: program.getSourceFile(fileName).getFullText(),
    }));
  }

  let failuresCount = 0;

  files.forEach(({ fileName, fileContents }) => {
    const configuration = Configuration.findConfiguration(
      tslintFilePath,
      fileName,
    ).results;

    linter.lint(fileName, fileContents, configuration);

    if (failuresCount !== linter.failures.length) {
      const fileFailures = linter.failures.slice(failuresCount);
      failuresCount = linter.failures.length;
      const formatted = format(options, [].concat(fileFailures));

      console.log(formatted);
    }
  });

  const fixablesCount = linter.failures.filter(failure => failure.fix).length;

  return { failuresCount, fixablesCount, fixesCount: linter.fixes.length };
}

module.exports = async ({
  pattern,
  tsconfigFilePath,
  tslintFilePath,
  options,
}) => {
  if (!pattern && !tsconfigFilePath) {
    throw new Error('a pattern or a tsconfig.json filePath must be supplied');
  }

  let filesPaths;

  if (pattern) {
    console.log(`running tslint on ${chalk.magenta(pattern)}`);
    filesPaths = globby.sync(pattern);
  } else {
    console.log(`running tslint using ${chalk.magenta(tsconfigFilePath)}`);
  }

  const { failuresCount, fixablesCount, fixesCount } = runLinter({
    options,
    tslintFilePath,
    tsconfigFilePath,
    filesPaths,
  });

  if (fixesCount > 0) {
    console.log(
      `fixed ${chalk.green(fixesCount)} ${
        fixesCount === 1 ? '' : 's'
      } using "--fix"`,
    );
  }

  if (failuresCount > 0) {
    let exitMessage = `tslint exited with ${chalk.red(failuresCount)} error${
      failuresCount === 1 ? '' : 's'
    }`;

    if (fixesCount === 0 && fixablesCount > 0) {
      exitMessage = exitMessage + ` (${chalk.green(fixablesCount)} fixable)`;
    }

    throw exitMessage;
  }
};
