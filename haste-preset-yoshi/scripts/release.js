const fs = require('fs');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const semver = require('semver');
const intersection = require('lodash/intersection');
const memoize = require('lodash/memoize');
const get = require('lodash/get');

const chosenPackages = process.argv.slice(2);
const packagesToReleaseFrom = ['haste-preset-yoshi', 'yoshi'];
const packagesToRelease = intersection(chosenPackages, packagesToReleaseFrom);

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';
const LATEST_TAG = 'latest';
const NEXT_TAG = 'next';
const OLD_TAG = 'old';

const packageJsonPath = require.resolve('../package.json');
const pkg = require(packageJsonPath);
const registry = get(pkg, 'publishConfig.registry', DEFAULT_REGISTRY);
const version = get(pkg, 'version');

const getPackageDetails = memoize(pkgName => {
  try {
    return JSON.parse(execSync(`npm show ${pkgName} --registry=${registry} --json`));
  } catch (error) {
    if (error.stderr.toString().includes('npm ERR! code E404')) {
      console.error(chalk.yellow('\nWarning: package not found. Possibly not published yet'));
      return {};
    }

    throw error;
  }
});

function getPublishedVersions(pkgName) {
  return getPackageDetails(pkgName).versions || [];
}

function getLatestVersion(pkgName) {
  return get(getPackageDetails(pkgName), 'dist-tags.latest');
}

function shouldPublishPackage(name) {
  const remoteVersionsList = getPublishedVersions(name);

  return !remoteVersionsList.includes(version);
}

function getTag(name) {
  const isLessThanLatest = () => semver.lt(version, getLatestVersion(name));

  const isPreRelease = () => semver.prerelease(version) !== null;

  // if the version is less than the version tagged as latest in the registry
  if (isLessThanLatest()) {
    return OLD_TAG;
  }

  // if it's a prerelease use the next tag
  if (isPreRelease()) {
    return NEXT_TAG;
  }

  return LATEST_TAG;
}

function modifyPackageJson(packageChanges) {
  const modifiedPkg = JSON.stringify(Object.assign({}, pkg, packageChanges), null, 2);
  fs.writeFileSync(packageJsonPath, modifiedPkg + '\n');
}

function publish(name) {
  modifyPackageJson({name});

  const publishCommand = `npm publish --tag=${getTag(name)} --registry=${registry}`;

  console.log(chalk.magenta(`Running: "${publishCommand}" for ${name}@${version}`));

  execSync(publishCommand);
}

function release(packagesToRelease) {
  console.log(`Starting the release process for ${packagesToRelease.join(' & ')}\n`);

  const unpublishablePackages = packagesToRelease.filter(name => !shouldPublishPackage(name));

  if (unpublishablePackages.length > 0) {
    unpublishablePackages.forEach(name => {
      console.log(chalk.blue(`${name}@${version} is already exist on registry ${registry}`));
    });

    console.log('\nNo publish performed');

    process.exit(0);
  }

  packagesToRelease.forEach(publish);

  console.log(chalk.green(`\nPublish ${packagesToRelease.map(name => `"${name}@${version}"`).join(' & ')} succesfully to ${registry}`));
}

try {
  // 1. verify that all packages can be published by checking the registry.
  // 2. go over each package name:
  // 2.1. replace the name in `package.json`.
  // 2.2. choose a tag ->
  // * `old` for a release that is less than latest (semver).
  // * `next` for a prerelease (beta/alpha/rc).
  // * `latest` as default.
  // 2.3. perform npm publish using the chosen tag.
  release(packagesToRelease);
} finally {
  // 3. write back the original `package.json`.
  modifyPackageJson();
}
