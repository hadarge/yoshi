const globby = require('globby');
const globs = require('yoshi-config/globs');

const { MATCH_ENV } = process.env;

module.exports.shouldRunE2Es = async () => {
  const filesPaths = await globby(globs.e2eTests);

  return (
    filesPaths.length > 0 &&
    (!MATCH_ENV || MATCH_ENV.split(',').includes('e2e'))
  );
};
