const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const tempy = require('tempy');
const execa = require('execa');
const globby = require('globby');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('./utils/publishMonorepo');

const isCI = !!process.env.TEAMCITY_VERSION;

const filterProject = process.env.FILTER_PROJECT;

const filterConfig = process.env.FILTER_CONFIG;

// Publish the entire monorepo and install everything from CI to get
// the maximum reliability
//
// Locally with symlink modules for faster feedback
const cleanup = isCI ? publishMonorepo() : () => {};

// Find all projects to run tests on
let projects = globby.sync('test/projects/*', {
  onlyDirectories: true,
  absolute: true,
});

if (filterProject) {
  projects = projects.filter(templateDirectory => {
    return templateDirectory.includes(filterProject);
  });
}

try {
  projects.forEach(templateDirectory => {
    console.log(`Testing ${templateDirectory}`);
    console.log();

    const rootDirectory = tempy.directory();

    const testDirectory = path.join(rootDirectory, 'project');

    fs.copySync(templateDirectory, testDirectory);

    // Symlink modules locally for faster feedback
    if (!isCI) {
      fs.ensureSymlinkSync(
        path.join(__dirname, '../packages/yoshi/node_modules'),
        path.join(rootDirectory, 'node_modules'),
      );

      fs.ensureSymlinkSync(
        path.join(__dirname, '../packages/yoshi/bin/yoshi.js'),
        path.join(rootDirectory, 'node_modules/.bin/yoshi'),
      );

      fs.ensureSymlinkSync(
        path.join(__dirname, '../packages/yoshi'),
        path.join(testDirectory, 'node_modules/yoshi'),
      );
    } else {
      // Authenticate and install from our fake registry on CI
      authenticateToRegistry(testDirectory);

      execa.shellSync('npm install', {
        cwd: testDirectory,
        stdio: 'inherit',
        extendEnv: false,
        env: {
          PATH: process.env.PATH,
        },
      });
    }

    // Copy mocked `node_modules`
    fs.copySync(
      path.join(templateDirectory, '__node_modules__'),
      path.join(testDirectory, 'node_modules'),
    );

    const options = {
      stdio: 'inherit',
      env: { ...process.env, TEST_DIRECTORY: testDirectory },
      cwd: templateDirectory,
    };

    // Find all Jest configs
    let configs = globby.sync(path.join(templateDirectory, 'jest.*.config.js'));

    if (filterConfig) {
      configs = configs.filter(configPath => {
        return configPath.includes(filterConfig);
      });
    }

    const failures = [];

    // Run them one by one
    try {
      configs.forEach(configPath => {
        console.log(`  > Running tests for ${configPath}`);
        console.log();

        try {
          execa.shellSync(
            `npx jest --config='${configPath}' --no-cache --runInBand`,
            options,
          );
        } catch (error) {
          failures.push(configPath);
        }

        console.log();
      });

      if (failures.length > 0) {
        console.log(chalk.red('Test failed!'));
        console.log();
        console.log('Check the following failed test runs:');
        console.log();

        failures.forEach(configPath => {
          console.log(`  - ${configPath}`);
        });

        console.log();

        process.exitCode = 1;
      }
    } finally {
      // If any fails, or when all are done, clean this project
      fs.removeSync(rootDirectory);
    }
  });
} finally {
  // Eventually, after all projects have finished, stop the local registry
  cleanup();
}
