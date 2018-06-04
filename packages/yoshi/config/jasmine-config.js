const globs = require('../src/globs');
const projectConfig = require('./project');

module.exports = {
  spec_dir: '', //eslint-disable-line camelcase
  spec_files: [
    //eslint-disable-line camelcase
    projectConfig.specs.node() || globs.specs(),
  ],
  helpers: [
    require.resolve('./jasmine-setup.js'),
    require.resolve('./test-setup.js'),
  ],
};
