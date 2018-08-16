const chalk = require('chalk');
const depkeeperPresetYoshi = require('@wix/depkeeper-preset-yoshi');

module.exports = ({ cwd = process.cwd() } = {}) => {
  return depkeeperPresetYoshi({ cwd }).then(({ fail, warn }) => {
    if (fail.length) {
      return logFail(fail);
    }
    if (warn.length) {
      return logWarn(warn);
    }
  });
};

function logFail(deps) {
  const formatedDeps = deps
    .map(
      ({ name, version, minimal }) =>
        chalk`${name}{redBright @${version}} must be at least {greenBright @${minimal}}`,
    )
    .join('\n');

  const message = chalk`{red ERROR: the following dependencies must be updated:\n}${formatedDeps}`;

  return Promise.reject(message);
}

function logWarn(deps) {
  const formatedDeps = deps
    .map(
      ({ name, version, minimal }) =>
        chalk`${name}{yellowBright @${version}} should be {greenBright @${minimal}}`,
    )
    .join('\n');

  const message = chalk`{yellow WARNING: some dependencies are a bit behind:\n}${formatedDeps}`;

  console.log(message);

  return Promise.resolve(message);
}
