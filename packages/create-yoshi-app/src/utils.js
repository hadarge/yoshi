const chalk = require('chalk');
const execa = require('execa');
const { privateRegistry } = require('./constants');

module.exports.clearConsole = () => process.stdout.write('\x1Bc');

module.exports.npmInstall = dir => {
  console.log(
    `Running ${chalk.magenta(
      'npm install',
    )}, that might take a few minutes... ⌛ \n`,
  );

  execa.shellSync('npm install', {
    cwd: dir,
    stdio: 'inherit',
    extendEnv: false,
    env: {
      PATH: process.env.PATH,
      // Somewhat hacky: Install from `process.env['npm_config_registry']` in PR CI
      // or from the private registry for actual users
      npm_config_registry:
        process.env['npm_config_registry'] || privateRegistry,
    },
  });
};

module.exports.isPrivateRegistryReachable = dir => {
  try {
    execa.shellSync(`curl ${privateRegistry}/v1`, {
      cwd: dir,
      stdio: 'pipe',
    });

    return true;
  } catch (_error) {
    return false;
  }
};

module.exports.lintFix = dir => {
  console.log(`\nRunning ${chalk.magenta('yoshi lint --fix')}\n`);
  execa.shellSync('npx yoshi lint --fix', {
    cwd: dir,
    stdio: 'inherit',
  });
};

module.exports.gitInit = dir => {
  console.log(`\nRunning ${chalk.magenta('git init')}\n`);

  const { stdout } = execa.shellSync('git init', {
    cwd: dir,
    stdio: 'pipe',
  });

  console.log(stdout + '\n');
};

module.exports.isInsideGitRepo = dir => {
  try {
    execa.shellSync('git rev-parse --is-inside-work-tree', {
      cwd: dir,
      stdio: 'pipe',
    });

    return true;
  } catch (_error) {
    return false;
  }
};
