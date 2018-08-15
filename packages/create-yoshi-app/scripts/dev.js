process.on('unhandledRejection', error => {
  throw error;
});

const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const chalk = require('chalk');
const prompts = require('prompts');
const chokidar = require('chokidar');
const clipboardy = require('clipboardy');
const {
  runPrompt,
  generateProject,
  replaceTemplates,
  getValuesMap,
} = require('../src/index');
const { clearConsole } = require('../src/utils');
const cache = require('./cache');
const Answers = require('../src/Answers');
const { appCacheKey } = require('../src/constants');

async function shouldContinueOldSession(projectType) {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `we've found an old session when you worked on a ${chalk.magenta(
      projectType,
    )} template.\n\n Answer ${chalk.cyan(
      'Yes',
    )} if you would like to continue working on it, or ${chalk.cyan(
      'No',
    )} to start a new session`,
    initial: true,
  });

  return response.value;
}

async function createApp({ cacheData, useCache }) {
  clearConsole();
  let answers;

  if (useCache) {
    answers = cacheData.answers;
  } else {
    answers = await runPrompt();

    clearConsole();
  }

  const workingDir = useCache
    ? cacheData.workingDir
    : path.join(tempy.directory(), `generated-${answers.fullProjectType}`);

  fs.ensureDirSync(workingDir);

  generateProject(answers, workingDir);
  // install(workingDir);
  // lintFix(workingDir);

  cache.set(appCacheKey, { answers, workingDir });

  console.log();

  if (useCache) {
    console.log(`continue working on ${chalk.green(workingDir)}`);
  } else {
    console.log(`project created on ${chalk.green(workingDir)}`);
  }

  console.log();
  console.log('> ', chalk.cyan('directory path has copied to clipboard 📋'));
  console.log();

  clipboardy.writeSync(workingDir);

  return { answers, workingDir };
}

function startWatcher(workingDir, answers) {
  const templatePath = answers.templatePath;

  console.log(`Watching ${chalk.magenta(templatePath)} for changes...`);
  console.log();

  const watcher = chokidar.watch('.', {
    ignored: 'node_modules',
    persistent: true,
    ignoreInitial: true,
    cwd: templatePath,
  });

  const valuesMap = getValuesMap(answers);

  const generateFile = relativePath => {
    const fullPath = path.join(templatePath, relativePath);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const destinationPath = path.join(workingDir, relativePath);

    const transformedContents = replaceTemplates(fileContents, valuesMap, {
      graceful: true,
    });

    const transformedDestinationPath = replaceTemplates(
      destinationPath,
      valuesMap,
      { graceful: true },
    );

    fs.outputFileSync(transformedDestinationPath, transformedContents);

    console.log(
      `${path.join(path.basename(templatePath), relativePath)} ${chalk.magenta(
        '->',
      )} ${chalk.cyan(transformedDestinationPath)}`,
    );
  };

  watcher.on('change', relativePath => {
    generateFile(relativePath);
  });

  watcher.on('add', relativePath => {
    generateFile(relativePath);
  });

  watcher.on('unlink', relativePath => {
    const destinationPath = path.join(workingDir, relativePath);
    fs.removeSync(destinationPath);
    console.log(chalk.red('removed ') + chalk.cyan(destinationPath));
  });

  // TODO: listen to directories events
}

async function init() {
  let useCache = false;
  let cacheData;

  if (cache.has(appCacheKey)) {
    cacheData = cache.get(appCacheKey);
    cacheData.answers = new Answers(cacheData.answers);

    if (await shouldContinueOldSession(cacheData.answers.fullProjectType)) {
      useCache = true;
    }
  }

  const { answers, workingDir } = await createApp({ useCache, cacheData });

  startWatcher(workingDir, answers);
}

init();
