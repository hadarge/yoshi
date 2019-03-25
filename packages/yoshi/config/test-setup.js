Object.assign(process.env, {
  NODE_ENV: 'test',
  SRC_PATH: './src',
});

const path = require('path');
const { tryRequire } = require('yoshi-helpers/utils');
const { isTypescriptProject } = require('yoshi-helpers/queries');
const { setupRequireHooks } = require('yoshi-helpers/require-hooks');

const ext = isTypescriptProject() && !process.env.IN_WALLABY ? 'ts' : 'js';
const mochaSetupPath = path.join(process.cwd(), 'test', `mocha-setup.${ext}`);
const setupPath = path.join(process.cwd(), 'test', `setup.${ext}`);

if (!process.env.IN_WALLABY) {
  setupRequireHooks();
}

require('../src/ignore-extensions');

tryRequire(mochaSetupPath);
tryRequire(setupPath);
