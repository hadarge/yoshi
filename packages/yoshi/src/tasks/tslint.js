const globby = require('globby');

const { Linter, Configuration } = require('tslint');

function runLinter({ options, tslintFilePath, tsconfigFilePath, filesPaths }) {
  const program = Linter.createProgram(tsconfigFilePath);
  const linter = new Linter(options, program);

  // If supplied filesPaths use them, otherwise, use tsconfig to getFileNames
  const filesNames = filesPaths ? filesPaths : Linter.getFileNames(program);

  filesNames.forEach(fileName => {
    const fileContents = program.getSourceFile(fileName).getFullText();
    const configuration = Configuration.findConfiguration(
      tslintFilePath,
      fileName,
    ).results;

    linter.lint(fileName, fileContents, configuration);
  });

  return linter.getResult();
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
    console.log(`running tslint on ${pattern}`);
    filesPaths = globby.sync(pattern);
  } else {
    console.log(`running tslint using ${tsconfigFilePath}`);
  }

  const { errorCount, output } = runLinter({
    options,
    tslintFilePath,
    tsconfigFilePath,
    filesPaths,
  });

  if (errorCount > 0) {
    throw output;
  }
};
