const path = require('path');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const semver = require('semver');
const memoize = require('lodash/memoize');
const get = require('lodash/get');

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';
const LATEST_TAG = 'latest';
const NEXT_TAG = 'next';
const OLD_TAG = 'old';

const packageJsonPath = path.resolve('./package.json');
const pkg = require(packageJsonPath);
const registry = get(pkg, 'publishConfig.registry', DEFAULT_REGISTRY);
const version = get(pkg, 'version');
const pkgName = get(pkg, 'name');

const getPackageDetails = memoize(name => {
  try {
    return JSON.parse(execSync(`npm show ${name} --registry=${registry} --json`));
  } catch (error) {
    if (error.stderr.toString().includes('npm ERR! code E404')) {
      console.error(chalk.yellow('\nWarning: package not found. Possibly not published yet'));
      return {};
    }

    throw error;
  }
});

function getPublishedVersions(name) {
  return getPackageDetails(name).versions || [];
}

function getLatestVersion(name) {
  return get(getPackageDetails(name), 'dist-tags.latest');
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

function publish(name) {
  const publishCommand = `npm publish --tag=${getTag(name)} --registry=${registry}`;

  console.log(chalk.magenta(`Running: "${publishCommand}" for ${name}@${version}`));

  execSync(publishCommand, { stdio: 'inherit' });
}

function release() {
  console.log(`Starting the release process for ${chalk.bold(pkgName)}\n`);

  if (!shouldPublishPackage(pkgName)) {
    console.log(chalk.blue(`${pkgName}@${version} is already exist on registry ${registry}`));
    console.log('\nNo publish performed');

    process.exit(0);
  }

  publish(pkgName);
  console.log(chalk.green(`\nPublish "${pkgName}@${version}" succesfully to ${registry}`));
}

// 1. verify that the package can be published by checking the registry.
//   (Can only publish versions that doesn't already exist)
// 2. choose a tag ->
// * `old` for a release that is less than latest (semver).
// * `next` for a prerelease (beta/alpha/rc).
// * `latest` as default.
// 3. perform npm publish using the chosen tag.
release(pkgName);
