#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const Mocha = require('mocha');

const testFile = require.resolve('./e2e.js');

// pass -v or --verbose to be in verbose mode
const verbose = argv.verbose || argv.v;

// Specify the specific projects that you want to run
// as command line arguments
const focusProjects = argv._.join(',');

// pre-configured for the test file
if (verbose) {
  process.env.VERBOSE_TESTS = verbose;
}

if (focusProjects) {
  process.env.FOCUS_PROJECTS = focusProjects;
}

// Instantiate a Mocha instance.
const mocha = new Mocha({
  timeout: 60 * 1000 * 20,
  reporter: process.env.TEAMCITY_VERSION ? 'mocha-teamcity-reporter' : 'spec',
  bail: true,
});

mocha.addFile(testFile);

mocha.run(function(failures) {
  // exit with non-zero status if there were failures
  process.exitCode = failures ? 1 : 0;
  console.log(`Mocha finished with ${failures} failures.`);
});
