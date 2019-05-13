const { partition } = require('lodash');
const importCwd = require('import-cwd');

const { getPackages } = importCwd('@lerna/project');

const packagesPromise = getPackages(process.cwd());

const splitPackagesPromise = packagesPromise.then(packages => {
  return partition(packages, pkg => pkg.private);
});

module.exports = {
  splitPackagesPromise,
};
