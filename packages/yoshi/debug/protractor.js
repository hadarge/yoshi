#!/usr/bin/env node

const chalk = require('chalk');
const terminalLink = require('terminal-link');

const readMoreLink = terminalLink(
  '🔗  Read more',
  'https://github.com/wix/yoshi/blob/master/docs/faq/DEBUGGING.md',
);
console.warn(`
              ╔════════════════════════════════╗
              ║ 🛑                            🛑 ║
              ║      ${chalk.underline('Deprecation Warning')}       ║
              ║                                ║
              ║      'yoshi' now supports      ║
              ║                                ║
              ║      ${chalk.green.bold('🖥  yoshi test --debug')}     ║
              ║                                ║
              ║      As a built in command     ║
              ║         for debugging          ║
              ║                                ║
              ║${chalk.blue("'./debug/protractor.js'")} will be ║
              ║       removed in the next      ║
              ║         major version          ║
              ║                                ║
              ║          ${readMoreLink}          ║
              ║ 🛑                            🛑 ║
              ╚════════════════════════════════╝
`);

Object.assign(process.env, { NODE_ENV: 'test', SRC_PATH: './src' });
process.argv = ['', '', './node_modules/yoshi/config/protractor.conf.js'];
require('../../protractor/bin/protractor'); // eslint-disable-line import/no-unresolved
