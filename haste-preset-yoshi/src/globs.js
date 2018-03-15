const path = require('path');

const dist = 'dist';
const statics = path.join(dist, 'statics');
const esModulesDist = path.join(dist, 'es');
const test = 'test';
const base = `{app,src,bin,${test},testkit,stories}`;
const assetsLegacyBase = `{app,bin,${test},testkit,stories}`;
const assetsBase = 'src';

module.exports = {
  base: () => base,
  assetsBase: () => assetsBase,
  assetsLegacyBase: () => assetsLegacyBase,
  statics: () => statics,
  babel: list => [path.join(list || base, '**', '*.js{,x}'), 'index.js'],
  specs: () => `${base}/**/*.+(spec|it).+(js|ts){,x}`,
  e2e: () => `${test}/**/*.e2e.{js,ts}`,
  singleModule: {
    clientDist: () => statics
  },
  multipleModules: {
    clientDist: () => dist,
  },
  esModulesDist: () => esModulesDist,
  tslint: () => [`${base}/**/*.ts{,x}`],
  less: () => [`${base}/**/*.less`, `!${base}/assets/**/*`],
  sass: () => [`${base}/**/*.scss`, `!${base}/assets/**/*`],
};
