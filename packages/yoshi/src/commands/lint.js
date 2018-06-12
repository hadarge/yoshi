const path = require('path');
const { createRunner } = require('haste-core');
const parseArgs = require('minimist');
const tslint = require('../tasks/tslint');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('../globs');

const {
  isTypescriptProject,
  shouldRunStylelint,
  watchMode,
} = require('../utils');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = runner.command(async tasks => {
  if (shouldWatch) {
    return;
  }

  const { eslint, stylelint } = tasks;
  // Variadic arguments are placed inside the "_" property array
  // https://github.com/substack/minimist#var-argv--parseargsargs-opts
  // The first argument is the command itself (lint), we retrieve all the rest
  const { styleFiles, jsFiles, tsFiles } =
    cliArgs._.length > 1
      ? groupFilesByType(cliArgs._.slice(1))
      : { jsFiles: [], tsFiles: [], styleFiles: [] };
  const shouldRunOnSpecificFiles = !!(
    jsFiles.length ||
    tsFiles.length ||
    styleFiles.length
  );

  if (shouldRunOnSpecificFiles) {
    if (styleFiles.length) {
      await runStyleLint(styleFiles);
    }

    if (isTypescriptProject() && tsFiles.length) {
      await runTsLint(tsFiles);
    } else if (jsFiles.length) {
      await runEsLint(jsFiles);
    }

    return null;
  }

  if (await shouldRunStylelint()) {
    await runStyleLint([
      `${globs.base()}/**/*.scss`,
      `${globs.base()}/**/*.less`,
    ]);
  }

  if (isTypescriptProject()) {
    await runTsLint();
  } else {
    await runEsLint(['*.js', `${globs.base()}/**/*.js`]);
  }

  function runStyleLint(pattern) {
    console.log(`running style lint on ${pattern}`);

    return stylelint({ pattern, options: { formatter: 'string' } });
  }

  function runTsLint(pattern) {
    const tsconfigFilePath = path.resolve('tsconfig.json');
    const tslintFilePath = path.resolve('tslint.json');

    return tslint({
      tsconfigFilePath,
      tslintFilePath,
      pattern,
      options: { fix: cliArgs.fix, formatter: cliArgs.format || 'stylish' },
    });
  }

  function runEsLint(pattern) {
    console.log(`running es lint on ${pattern}`);

    return eslint({
      pattern,
      options: {
        cache: true,
        cacheLocation: 'target/.eslintcache',
        fix: cliArgs.fix,
        formatter: cliArgs.format,
      },
    });
  }
});

function groupFilesByType(fileList) {
  return fileList.reduce(
    (files, filename) => {
      if (isStyleFile(filename)) {
        files.styleFiles.push(filename);
      } else if (isTypescriptFile(filename)) {
        files.tsFiles.push(filename);
      } else if (isJavascriptFile(filename)) {
        files.jsFiles.push(filename);
      }
      return files;
    },
    { jsFiles: [], tsFiles: [], styleFiles: [] },
  );
}

function isJavascriptFile(filename) {
  return filename.endsWith('.js');
}

function isTypescriptFile(filename) {
  return filename.endsWith('.ts') || filename.endsWith('.tsx');
}

function isStyleFile(filename) {
  return (
    filename.endsWith('.css') ||
    filename.endsWith('.scss') ||
    filename.endsWith('.less')
  );
}
