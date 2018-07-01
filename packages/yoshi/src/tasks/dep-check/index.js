const chalk = require('chalk');
const depkeeper = require('depkeeper');

module.exports = ({ cwd = process.cwd() } = {}) => {
  return depkeeper({ cwd })
    .rule('wix-style-react', { major: 2 })
    .rule('{yoshi,wix-style-react}')
    .rule('wix-bootstrap-*', { patch: 5 })
    .checkRules()
    .then(([wixStyleReactOutdated, wsrYoshiOutdated, bootstrapOutdated]) => {
      if (wixStyleReactOutdated.length) {
        return fail(wixStyleReactOutdated);
      }

      if (wsrYoshiOutdated.length) {
        return warn(wsrYoshiOutdated);
      }

      if (bootstrapOutdated.length) {
        return warn(bootstrapOutdated);
      }
    });
};

function fail(deps) {
  const formatedDeps = deps
    .map(
      ({ name, version, minimal }) =>
        chalk`${name}{redBright @${version}} must be at least {greenBright @${minimal}}`,
    )
    .join('\n');

  const message = chalk`{red ERROR: the following dependencies must be updated:\n}${formatedDeps}`;

  return Promise.reject(message);
}

function warn(deps) {
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
