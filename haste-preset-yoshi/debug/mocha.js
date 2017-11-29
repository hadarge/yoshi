#!/usr/bin/env node

Object.assign(process.env, {NODE_ENV: 'test', SRC_PATH: './src'});
process.argv = ['', '', '{test,src}/**/*.spec.js{,x}', '--no-timeouts', '--require', './node_modules/haste-preset-yoshi/config/mocha-setup.js'];
require('../../mocha/bin/_mocha');
