const path = require('path');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fs = require('fs');
const semver = require('semver');
const memoize = require('lodash/memoize');
const get = require('lodash/get');

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';
const LATEST_TAG = 'latest';
const NEXT_TAG = 'next';
const OLD_TAG = 'old';

const getPackageDetails = memoize(pkg => {
  try {
    return JSON.parse(
      execSync(`npm show ${pkg.name} --registry=${pkg.registry} --json`),
    );
  } catch (error) {
    if (error.stderr.toString().includes('npm ERR! code E404')) {
      console.error(
        chalk.red(
          '\nError: package not found. Possibly not published yet, please verify that this package is published to npm.\n\nExit with status 1',
        ),
      );

      // This script will not publish new packages to npm
      process.exit(0);
    }

    throw error;
  }
});

function getPublishedVersions(pkg) {
  return getPackageDetails(pkg).versions || [];
}

function getLatestVersion(pkg) {
  return get(getPackageDetails(pkg), 'dist-tags.latest');
}

function shouldPublishPackage(pkg) {
  const remoteVersionsList = getPublishedVersions(pkg);

  return !remoteVersionsList.includes(pkg.version);
}

function getTag(pkg) {
  const isLessThanLatest = () => semver.lt(pkg.version, getLatestVersion(pkg));
  const isPreRelease = () => semver.prerelease(pkg.version) !== null;

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

function publish(pkg) {
  const publishCommand = `npm publish ${pkg.pkgPath} --tag=${getTag(
    pkg,
  )} --registry=${pkg.registry}`;

  console.log(`Running: "${publishCommand}" for ${pkg.name}@${pkg.version}`);

  execSync(publishCommand, { stdio: 'inherit' });
}

function release(pkg) {
  if (pkg.private) {
    console.log(`> ${pkg.name}(private) - skip publish`);
    return;
  }

  if (!shouldPublishPackage(pkg)) {
    console.log(
      `> ${pkg.name}@${pkg.version} - skip publish (version exist on registry ${pkg.registry})`,
    );

    return;
  }

  publish(pkg);
  console.log(
    `> ${pkg.name}@${pkg.version} - published successfully to ${pkg.registry}`,
  );
}

// 1. Read package.json
// 2. If the package is private, skip publish
// 3. If the package already exist on the registry, skip publish.
// 4. choose a dist-tag ->
//    * `old` for a release that is less than latest (semver).
//    * `next` for a prerelease (beta/alpha/rc).
//    * `latest` as default.
// 5. perform npm publish using the chosen tag.

const pkgPath = process.cwd();
const pkgJsonPath = path.resolve(pkgPath, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgJsonPath));

release({
  private: get(pkg, 'private'),
  name: get(pkg, 'name'),
  version: get(pkg, 'version'),
  registry: get(pkg, 'publishConfig.registry', DEFAULT_REGISTRY),
  pkgPath,
});
