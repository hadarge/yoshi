const findCacheDir = require('find-cache-dir');
const fs = require('fs-extra');
const { appCacheDirname } = require('../src/constants.js');

// '/some/path/node_modules/.cache/create-yoshi-app'
const thunk = findCacheDir({ name: appCacheDirname, thunk: true });

const addJsonSuffix = str => str + '.json';
const getCachePath = key => thunk(addJsonSuffix(key));

// module.exports.clear = () => {
//   fs.rmdirSync(thunk());
// };

module.exports.set = (key, obj) => {
  fs.outputFileSync(getCachePath(key), JSON.stringify(obj));
};

module.exports.get = key => {
  return fs.readJsonSync(getCachePath(key));
};

module.exports.has = key => {
  return fs.existsSync(getCachePath(key));
};
