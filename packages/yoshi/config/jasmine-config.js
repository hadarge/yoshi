const globs = require('../src/globs');
const projectConfig = require('./project');

module.exports = {
  spec_dir: '',
  spec_files: [projectConfig.specs.node() || globs.specs()],
  helpers: [
    require.resolve('./jasmine-setup.js'),
    require.resolve('./test-setup.js'),
  ],
  stopSpecOnExpectationFailure: false,
  random: false,
};
