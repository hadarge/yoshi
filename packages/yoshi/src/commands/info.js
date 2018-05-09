const path = require('path');
const envinfo = require('envinfo');
const chalk = require('chalk');

const pkg = require(path.resolve(process.cwd(), 'package.json'));

module.exports = async () => {
  console.log(
    await envinfo.run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
      Browsers: ['Chrome', 'Firefox', 'Safari'],
      npmPackages: ['yoshi', 'webpack', 'storybook'],
    }),
  );

  if (pkg.yoshi) {
    console.log(' ' + chalk.underline('Yoshi config'));
    console.log(JSON.stringify(pkg.yoshi, null, 2));
  } else {
    console.log(' Zero config 🛴');
  }
};
