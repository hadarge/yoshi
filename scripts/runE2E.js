#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const Mocha = require('mocha');

const testFile = require.resolve('../tests/e2e.js');

// pass -v or --verbose to be in verbose mode
const verbose = argv.verbose || argv.v;
// pass a second argument of a regex pattern
// to run a focus test on the matched projects types
const focusProjectPattern = argv._[0];

// pre-configured for the test file
if (verbose) {
  process.env.VERBOSE_TESTS = verbose;
}

if (focusProjectPattern) {
  process.env.FOCUS_PATTERN = focusProjectPattern;
}

// Instantiate a Mocha instance.
const mocha = new Mocha({
  timeout: 180000,
  reporter: process.env.TEAMCITY_VERSION ? 'mocha-teamcity-reporter' : 'spec',
});

mocha.addFile(testFile);

mocha.run(function(failures) {
  // exit with non-zero status if there were failures
  process.exitCode = failures ? -1 : 0;
});
