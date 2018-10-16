const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve('./package.json'), 'utf-8'),
);

if (packageJson.publishConfig) {
  console.error(
    `Package "${chalk.red(
      packageJson.name,
    )}" have a redundant publishConfig to the following registry "${chalk.red(
      packageJson.publishConfig.registry,
    )}"`,
  );

  process.exit(1);
}

process.exit(0);
