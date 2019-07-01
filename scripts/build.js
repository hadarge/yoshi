const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const stringLength = require('string-length');
const execa = require('execa');

const OK = chalk.reset.inverse.bold.green(' DONE ');

const packagesDir = path.resolve(__dirname, '../packages');

const packages = globby.sync('*', {
  cwd: packagesDir,
  onlyDirectories: true,
  absolute: true,
});

const packagesWithTs = packages.filter(p =>
  fs.existsSync(path.resolve(p, 'tsconfig.json')),
);

const args = [
  path.resolve(
    require.resolve('typescript/package.json'),
    '..',
    require('typescript/package.json').bin.tsc,
  ),
  '-b',
  ...packagesWithTs,
  ...process.argv.slice(2),
];

console.log(chalk.inverse('Building TypeScript files'));
process.stdout.write(adjustToTerminalWidth('Building\n'));

try {
  execa.sync('node', args, { stdio: 'inherit' });
  process.stdout.write(`${OK}\n`);
} catch (e) {
  process.stdout.write('\n');
  console.error(chalk.inverse.red('Unable to build TypeScript files'));
  console.error(e.stack);
  process.exitCode = 1;
}

function adjustToTerminalWidth(str) {
  const columns = process.stdout.columns || 80;
  const WIDTH = columns - stringLength(OK) + 1;
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'));
  let lastString = strs[strs.length - 1];
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'));
  }
  return strs
    .slice(0, -1)
    .concat(lastString)
    .join('\n');
}
