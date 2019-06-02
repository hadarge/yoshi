const path = require('path');
const execa = require('execa');
const { createRunner } = require('haste-core');
const parseArgs = require('minimist');
const chalk = require('chalk');
const tslint = require('../tasks/tslint');
const eslint = require('../tasks/eslint');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const globs = require('yoshi-config/globs');

const { isTypescriptProject, watchMode } = require('yoshi-helpers/queries');

const { hooks } = require('yoshi-config');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2), {
  boolean: ['fix'],
});

module.exports = runner.command(async () => {
  if (shouldWatch) {
    return;
  }

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

  const { prelint } = hooks;

  const lintErrors = [];

  if (prelint) {
    await execa.shell(prelint, { stdio: 'inherit' });
  }

  if (isTypescriptProject()) {
    const tsFilesToLint =
      shouldRunOnSpecificFiles && (tsFiles.length || jsFiles.length)
        ? [...tsFiles, ...jsFiles]
        : undefined;

    try {
      await runTsLint(tsFilesToLint);
    } catch (error) {
      lintErrors.push(error);
    }
  } else {
    const jsFilesToLint =
      shouldRunOnSpecificFiles && jsFiles.length
        ? jsFiles
        : [...globs.baseDirs.map(dir => `${dir}/**/*.js`), '*.js'];

    try {
      await runEsLint(jsFilesToLint);
    } catch (error) {
      lintErrors.push(error);
    }
  }

  if (lintErrors.length) {
    console.error(chalk.red(lintErrors.join('\n\n')));
    process.exit(1);
  }

  async function runTsLint(pattern) {
    const tsconfigFilePath = path.resolve('tsconfig.json');
    const tslintFilePath = path.resolve('tslint.json');

    return tslint({
      tsconfigFilePath,
      tslintFilePath,
      pattern,
      options: { fix: cliArgs.fix, formatter: cliArgs.format || 'stylish' },
    });
  }

  async function runEsLint(pattern) {
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
