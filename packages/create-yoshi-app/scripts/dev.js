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
const { replaceTemplates, getValuesMap } = require('../src/index');
const cache = require('./cache');
const TemplateModel = require('../src/TemplateModel');
const { appCacheKey } = require('../src/constants');
const createApp = require('../src/createApp');

async function shouldContinueOldSession(templateTitle) {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `we've found an old session when you worked on a ${chalk.magenta(
      templateTitle,
    )} template.\n\n Answer ${chalk.cyan(
      'Yes',
    )} if you would like to continue working on it, or ${chalk.cyan(
      'No',
    )} to start a new session`,
    initial: true,
  });

  return response.value;
}

function startWatcher(workingDir, templateModel) {
  const templatePath = templateModel.getPath();

  console.log(`Watching ${chalk.magenta(templatePath)} for changes...`);
  console.log();

  const watcher = chokidar.watch('.', {
    ignored: 'node_modules',
    persistent: true,
    ignoreInitial: true,
    cwd: templatePath,
  });

  const valuesMap = getValuesMap(templateModel);

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
}

async function init() {
  let templateModel;
  let workingDir;
  let cacheData;
  let readFromCache;

  if (cache.has(appCacheKey)) {
    cacheData = cache.get(appCacheKey);
    cacheData.templateModel = TemplateModel.fromJSON(cacheData.templateModel);

    if (await shouldContinueOldSession(cacheData.templateModel.getTitle())) {
      readFromCache = true;
    }
  }

  if (readFromCache) {
    templateModel = cacheData.templateModel;
    workingDir = cacheData.workingDir;

    await createApp({
      workingDir,
      templateModel,
      install: false,
      lint: false,
    });
  } else {
    workingDir = tempy.directory();

    templateModel = await createApp({
      workingDir,
      install: false,
      lint: false,
    });

    cache.set(appCacheKey, {
      templateModel,
      workingDir,
    });
  }

  clipboardy.writeSync(workingDir);

  console.log('> ', chalk.cyan('directory path has copied to clipboard 📋'));
  console.log();

  startWatcher(workingDir, templateModel);
}

init();
