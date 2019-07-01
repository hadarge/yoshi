import path from 'path';

const distDir = 'dist';

const esModulesDist = path.join(distDir, 'es');

export const statics = path.join(distDir, 'statics');

export const baseDirs = [
  'app',
  'src',
  'bin',
  'test',
  '__tests__',
  'testkit',
  'stories',
  'packages',
];

export const assetsLegacyBaseDirs = [
  'app',
  'bin',
  'test',
  'testkit',
  'stories',
];

export const assetsBase = 'src';

export const dist = ({ esTarget = false } = {}) =>
  esTarget ? esModulesDist : distDir;

export const babel = [
  ...baseDirs.map(dir => path.join(dir, '**', '*.js{,x}')),
  'index.js',
];

export const specs = baseDirs.map(dir => `${dir}/**/*.+(spec|it).+(ts|js){,x}`);

export const e2eTests = baseDirs.map(dir => `${dir}/**/*.e2e.+(ts|js){,x}`);

export const unitTests = baseDirs.map(dir => `${dir}/**/*.spec.+(ts|js){,x}`);

export const testFilesWatch = [
  ...baseDirs.map(dir => path.join(dir, '**', '*.(ts|js){,x}')),
  'index.js',
];

export const singleModule = {
  clientDist: statics,
};

export const multipleModules = {
  clientDist: distDir,
};

export const less = [
  ...baseDirs.map(dir => `${dir}/**/*.less`),
  ...baseDirs.map(dir => `!${dir}/assets/**/*`),
];

export const scss = [
  ...baseDirs.map(dir => `${dir}/**/*.scss`),
  ...baseDirs.map(dir => `!${dir}/assets/**/*`),
];
