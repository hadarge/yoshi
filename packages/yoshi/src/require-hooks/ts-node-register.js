require('ts-node').register({
  fast: true,
  compilerOptions: {
    // force commonjs modules
    module: 'commonjs',
    // allow using Promises, Array.prototype.includes, String.prototype.padStart, etc.
    lib: ['es2017'],
    // use async/await instead of embedding polyfills
    target: 'es2017',
  },
});
