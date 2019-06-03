const path = require('path');

const dist = 'dist';
const statics = path.join(dist, 'statics');
const esModulesDist = path.join(dist, 'es');
const baseDirs = [
  'app',
  'src',
  'bin',
  'test',
  '__tests__',
  'testkit',
  'stories',
  'packages',
];
const assetsLegacyBaseDirs = ['app', 'bin', 'test', 'testkit', 'stories'];
const assetsBase = 'src';

module.exports = {
  baseDirs,
  dist: ({ esTarget } = {}) => (esTarget ? esModulesDist : dist), // TODO - remove function
  assetsBase,
  assetsLegacyBaseDirs,
  statics,
  babel: [...baseDirs.map(dir => path.join(dir, '**', '*.js{,x}')), 'index.js'],
  specs: baseDirs.map(dir => `${dir}/**/*.+(spec|it).+(ts|js){,x}`),
  e2eTests: baseDirs.map(dir => `${dir}/**/*.e2e.+(ts|js){,x}`),
  unitTests: baseDirs.map(dir => `${dir}/**/*.spec.+(ts|js){,x}`),
  testFilesWatch: [
    ...baseDirs.map(dir => path.join(dir, '**', '*.(ts|js){,x}')),
    'index.js',
  ],
  singleModule: {
    clientDist: statics,
  },
  multipleModules: {
    clientDist: dist,
  },
  less: [
    ...baseDirs.map(dir => `${dir}/**/*.less`),
    ...baseDirs.map(dir => `!${dir}/assets/**/*`),
  ],
  scss: [
    ...baseDirs.map(dir => `${dir}/**/*.scss`),
    ...baseDirs.map(dir => `!${dir}/assets/**/*`),
  ],
};
