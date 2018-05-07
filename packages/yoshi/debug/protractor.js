#!/usr/bin/env node

Object.assign(process.env, { NODE_ENV: 'test', SRC_PATH: './src' });
process.argv = ['', '', './node_modules/yoshi/config/protractor.conf.js'];
require('../../protractor/bin/protractor');
