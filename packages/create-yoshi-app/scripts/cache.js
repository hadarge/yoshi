const findCacheDir = require('find-cache-dir');
const fs = require('fs-extra');
const { appCacheDirname } = require('../src/constants');

// '/some/path/node_modules/.cache/create-yoshi-app'
const thunk = findCacheDir({ name: appCacheDirname, thunk: true });

const addJsonSuffix = str => str + '.json';
const getCachePath = key => thunk(addJsonSuffix(key));

// module.exports.clear = () => {
//   fs.rmdirSync(thunk());
// };

module.exports = cacheKey => {
  const cachePath = getCachePath(cacheKey);

  return {
    set: obj => {
      return fs.outputFileSync(cachePath, JSON.stringify(obj));
    },
    get: () => {
      return fs.readJsonSync(cachePath);
    },
    has: () => {
      return fs.existsSync(cachePath);
    },
  };
};
