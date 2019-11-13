#!/usr/bin/env node

const config = require('yoshi-config');

const passedArgv = process.argv.slice(2);
const command = passedArgv[0];

if (['build', 'start'].includes(command) && config.projectType === 'app') {
  require('yoshi-flow-app/build/bin/yoshi-app');
} else {
  require('yoshi-flow-legacy/bin/yoshi-legacy');
}
