const path = require('path');
const chalk = require('chalk');
const { getEnvInfo } = require('../env-info');

const pkg = require(path.resolve(process.cwd(), 'package.json'));

module.exports = async () => {
  console.log(await getEnvInfo());

  if (pkg.yoshi) {
    console.log(' ' + chalk.underline('Yoshi config'));
    console.log(JSON.stringify(pkg.yoshi, null, 2));
  } else {
    console.log(' Zero config 🛴');
  }
};
