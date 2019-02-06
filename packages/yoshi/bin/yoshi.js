#!/usr/bin/env node
const importLocal = require('import-local');
const verifyMinimumNodeVersion = require('yoshi-helpers/verifyMinimumNodeVersion');
const { minimumNodeVersion } = require('../src/constants');

verifyMinimumNodeVersion(minimumNodeVersion);

if (!importLocal(__filename)) {
  require('./yoshi-cli');
}
