const globby = require('globby');
const projectConfig = require('yoshi-config');
const globs = require('yoshi-config/globs');

module.exports = {
  spec_dir: '',
  spec_files: [].concat(projectConfig.specs.node || globby.sync(globs.specs)),
  helpers: [
    require.resolve('./jasmine-setup.js'),
    require.resolve('./test-setup.js'),
  ],
  stopSpecOnExpectationFailure: false,
  random: false,
};
