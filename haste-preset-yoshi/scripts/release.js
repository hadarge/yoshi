const fs = require('fs');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const semver = require('semver');
const intersection = require('lodash/intersection');

const chosenPackages = process.argv.slice(2);
const packagesToReleaseFrom = ['haste-preset-yoshi', 'yoshi'];
const packagesToRelease = intersection(chosenPackages, packagesToReleaseFrom);

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';
const packageJsonPath = require.resolve('../package.json');
const pkg = require(packageJsonPath);
const version = pkg.version;
const publishConfig = pkg.publishConfig || {};
const registry = publishConfig.registry || DEFAULT_REGISTRY;
let tag = 'latest';

if (semver.prerelease(version) !== null) {
  tag = 'next';
}

function getPublishedVersions(pkgName, registry) {
  try {
    const rawVersions = execSync(`npm show ${pkgName} versions --registry=${registry} --json`);
    return JSON.parse(rawVersions);
  } catch (error) {
    if (error.stderr.toString().includes('npm ERR! code E404')) {
      console.error(chalk.yellow('\nWarning: package not found. Possibly not published yet'));
      return [];
    }

    throw error;
  }
}

function shouldPublishPackage(name, version, registry) {
  const versions = getPublishedVersions(name, registry);

  return !versions.includes(version);
}

function modifyPackageJson(packageChanges) {
  const modifiedPkg = JSON.stringify(Object.assign({}, pkg, packageChanges), null, 2);
  fs.writeFileSync(packageJsonPath, modifiedPkg);
}

function publish(name) {
  modifyPackageJson({name});

  const publishCommand = `npm publish --tag=${tag} --registry=${registry}`;

  console.log(chalk.magenta(`running: "${publishCommand}" for ${name}@${version}`));

  execSync(publishCommand);
}

function release(packagesToRelease) {
  console.log(`starting the release process for ${packagesToRelease.join(' & ')}\n`);
  const unpublishablePackages = packagesToRelease.filter(name => !shouldPublishPackage(name, version, registry));

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
  // 1. choose a tag -> `next` for prerelease (beta/alpha/rc) and `latest` for release.
  // 2. verify that all packages can be published by checking the registry.
  // 3. go over each package name:
  // 3.1. replace the name in `package.json`.
  // 3.2. perform npm publish using the chosen tag.
  release(packagesToRelease);
} finally {
  // 4. write back the original `package.json`.
  modifyPackageJson();
}
