const path = require('path');

const dist = 'dist';
const statics = path.join(dist, 'statics');
const esModulesDist = path.join(dist, 'es');
const base = `{app,src,bin,test,__tests__,testkit,stories}`;
const assetsLegacyBase = `{app,bin,test,testkit,stories}`;
const assetsBase = 'src';

module.exports = {
  base,
  dist: ({ esTarget } = {}) => (esTarget ? esModulesDist : dist), // TODO - remove function
  assetsBase,
  assetsLegacyBase,
  statics,
  babel: [path.join(base, '**', '*.js{,x}'), 'index.js'],
  specs: `${base}/**/*.+(spec|it).+(js|ts){,x}`,
  e2eTests: `${base}/**/*.e2e.+(js|ts){,x}`,
  unitTests: `${base}/**/*.spec.+(ts|js){,x}`,
  testFilesWatch: [path.join(base, '**', '*.(ts|js){,x}'), 'index.js'],
  singleModule: {
    clientDist: statics,
  },
  multipleModules: {
    clientDist: dist,
  },
  less: [`${base}/**/*.less`, `!${base}/assets/**/*`],
  scss: [`${base}/**/*.scss`, `!${base}/assets/**/*`],
};
