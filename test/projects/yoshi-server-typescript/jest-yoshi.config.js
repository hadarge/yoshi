module.exports = {
  server: {
    command: 'node index.js',
    port: 3100,
  },
  specOptions: {
    moduleNameMapper: {
      // We symlink modules locally and should only have a single
      // React dependency.
      //
      // Similar to an `externals` configuration in Webpack.
      '^react$': require.resolve('react'),
    },
  },
};
