const path = require('path');
const fs = require('fs-extra');
const tempy = require('tempy');
const execa = require('execa');
const globby = require('globby');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('./utils/publishMonorepo');

const isCI = !!process.env.TEAMCITY_VERSION;

// Publish the entire monorepo and install everything from CI to get
// the maximum reliability
//
// Locally with symlink modules for faster feedback
const cleanup = isCI ? publishMonorepo() : () => {};

// Find all projects to run tests on
const projects = globby.sync('test/*', {
  onlyDirectories: true,
  absolute: true,
});

try {
  projects.forEach(templateDirectory => {
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
    };

    // Find all Jest configs
    const configs = globby.sync(
      path.join(templateDirectory, 'jest.*.config.js'),
    );

    // Run them one by one
    try {
      configs.forEach(configPath => {
        execa.shellSync(
          `npx jest --config='${configPath}' --no-cache --runInBand`,
          options,
        );
      });
    } finally {
      // If any fails, or when all are done, clean this project
      fs.removeSync(rootDirectory);
    }
  });
} finally {
  // Eventually, after all projects have finished, stop the local registry
  cleanup();
}
