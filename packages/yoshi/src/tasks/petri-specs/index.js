const path = require('path');
const petriSpecs = require('petri-specs');

module.exports = async ({
  config = {},
  base = process.cwd(),
  destDir = path.join('dist', 'statics'),
}) => {
  const directory = path.join(base, 'petri-specs');
  const destFile = path.join(base, destDir, 'petri-experiments.json');
  const options = Object.assign({ directory, json: destFile, base }, config);

  petriSpecs.build(options);
};
