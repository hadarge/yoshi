const threadLoader = require('./thread');

const isDevelopment = process.env.NODE_ENV === 'development';

const compilerOptions = {
  // force es modules for tree shaking
  module: 'esnext',
  // use same module resolution
  moduleResolution: 'node',
  // optimize target to latest chrome for local development
  ...(isDevelopment
    ? {
        // allow using Promises, Array.prototype.includes, String.prototype.padStart, etc.
        lib: ['es2017'],
        // use async/await instead of embedding polyfills
        target: 'es2017',
      }
    : {}),
};

const disableTsThreadOptimization =
  process.env.DISABLE_TS_THREAD_OPTIMIZATION === 'true';

module.exports = isAngularProject => ({
  test: /\.tsx?$/,
  exclude: /(node_modules)/,
  use: [
    ...(disableTsThreadOptimization ? [] : [threadLoader()]),
    ...(isAngularProject ? ['ng-annotate-loader'] : []),
    {
      loader: 'ts-loader?{"logLevel":"warn"}',
      options: {
        // Sets *transpileOnly* to true and WARNING! stops registering all errors to webpack.
        // Needed for HappyPack or thread-loader.
        happyPackMode: !disableTsThreadOptimization,
        compilerOptions: isAngularProject ? {} : compilerOptions,
      },
    },
  ],
});
