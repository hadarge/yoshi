import { multipleValidOptions } from 'jest-validate';
import { InitialConfig } from './config';
import { RequiredRecursively } from './utils';

const validConfig: RequiredRecursively<InitialConfig> = {
  extends: 'preset',
  separateCss: multipleValidOptions(true, 'prod' as 'prod'),
  splitChunks: multipleValidOptions({}, false) as any,
  cssModules: true,
  tpaStyle: false,
  enhancedTpaStyle: false,
  features: {
    externalizeRelativeLodash: false,
  },
  clientProjectName: 'project',
  keepFunctionNames: false,
  entry: multipleValidOptions(
    'index.js',
    ['one.js'],
    { two: 'two.js' },
    {
      app: 'index.js',
    },
  ),
  servers: {
    cdn: {
      url: 'http://localhost:3200',
      port: 3200,
      dir: 'statics',
      ssl: false,
    },
  },
  resolveAlias: {
    hello: 'world',
  },
  externals: multipleValidOptions(['React'], { react: 'React' }),
  specs: {
    browser: 'test/**/*.spec.js',
    node: 'test/**/*.spec.js',
  },
  petriSpecs: {
    onlyForLoggedInUsers: false,
    scopes: ['me'],
  },
  transpileTests: true,
  externalUnprocessedModules: ['react'],
  exports: '[name]',
  hmr: multipleValidOptions(true, 'auto' as 'auto'),
  liveReload: false,
  performance: multipleValidOptions({}, false) as any,
  hooks: {
    prelint: 'npm run stuff',
  },
  umdNamedDefine: false,
  projectType: 'app',
  experimentalBuildHtml: false,
  experimentalMonorepo: false,
  experimentalMinimalPRBuild: false,
  experimentalRtlCss: false,
  startUrl: multipleValidOptions('http://localhost:3000', [
    'http://localhost:3000/hello',
    'http://localhost:3000/world',
  ]),
  webWorker: {
    entry: multipleValidOptions(
      'index.js',
      ['one.js'],
      { two: 'two.js' },
      {
        app: 'index.js',
      },
    ),
    externals: multipleValidOptions(['React'], { react: 'React' }),
  },
};

export default validConfig;
