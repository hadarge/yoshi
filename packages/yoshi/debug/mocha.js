#!/usr/bin/env node

Object.assign(process.env, { NODE_ENV: 'test', SRC_PATH: './src' });
process.argv = [
  '',
  '',
  '{test,src}/**/*.spec.{t,j}s{,x}',
  '--no-timeouts',
  '--require',
  './node_modules/yoshi/config/mocha-setup.js',
];
require('../../mocha/bin/_mocha');
