const fs = require('fs');

exports.process = (src, path) => {
  const fn = require('stylable-integration/dist/src/stylable-to-module-factory').stylableToModuleFactory(
    fs,
    require,
  );
  const result = fn(src, path);

  //This is a temporary patch until stylable-integration will allow passing a path / use absolute path for stylable/runtime
  return result.replace(
    'stylable/runtime',
    require.resolve('stylable/runtime'),
  );
};
