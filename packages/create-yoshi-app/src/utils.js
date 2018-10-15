const chalk = require('chalk');
const execa = require('execa');

module.exports.clearConsole = () => process.stdout.write('\x1Bc');

module.exports.install = dir => {
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
    },
  });
};

module.exports.getRegistry = dir => {
  // TODO: change to npm ping to the private registry when it will be fixed with the CI team
  const { stdout } = execa.shellSync('npm config get registry', {
    cwd: dir,
    stdio: 'pipe',
  });

  return stdout;
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
