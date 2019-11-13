const { CLIEngine } = require('eslint');
const globby = require('globby');

module.exports = async ({ pattern, options = {} }) => {
  const fileNames = globby.sync(pattern, {
    absolute: true,
    onlyFiles: true,
    ignore: ['**/node_modules'],
  });

  const cli = new CLIEngine(options);
  const report = cli.executeOnFiles(fileNames);

  const formatter = cli.getFormatter(options.formatter);
  options.fix && CLIEngine.outputFixes(report);

  const errors = CLIEngine.getErrorResults(report.results);

  if (errors.length) {
    throw formatter(report.results);
  }

  if (report.warningCount) {
    console.warn(formatter(report.results));
  }
};
