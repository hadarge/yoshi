const globby = require('globby');
const chalk = require('chalk');
const intersection = require('lodash/intersection');
const difference = require('lodash/difference');
const isEqual = require('lodash/isEqual');

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

function runLinter({ options, tslintFilePath, tsconfigFilePath, filterPaths }) {
  // not all of our users have typescript installed.
  // tslint requires typescript to exist in node_modules when imported,
  // that should happen only when runLinter function is called in oppose to upon import
  const { Linter, Configuration } = require('tslint');

  const program = Linter.createProgram(tsconfigFilePath);
  const linter = new Linter(options, program);
  const linterFileNames = Linter.getFileNames(program);

  let filePaths = linterFileNames;

  if (filterPaths) {
    filePaths = intersection(filterPaths, linterFileNames);

    if (!isEqual(filePaths, filterPaths)) {
      const wontBeLinted = difference(filterPaths, linterFileNames);
      console.warn(
        chalk.yellow(
          ' ● Warning: The following files were supplied to "yoshi lint" as a pattern\n' +
            `   but were not specified in "${tsconfigFilePath}", therefore will not be linted:\n\n` +
            chalk.bold(wontBeLinted.join('\n')),
        ),
      );
    }
  }

  const files = filePaths.map(fileName => ({
    fileName,
    fileContents: program.getSourceFile(fileName).getFullText(),
  }));

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

  let filterPaths;

  if (pattern) {
    console.log(`running tslint on ${chalk.magenta(pattern)}\n`);
    filterPaths = globby.sync(pattern, { absolute: true });
  } else {
    console.log(`running tslint using ${chalk.magenta(tsconfigFilePath)}\n`);
  }

  const { failuresCount, fixablesCount, fixesCount } = runLinter({
    options,
    tslintFilePath,
    tsconfigFilePath,
    filterPaths,
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
