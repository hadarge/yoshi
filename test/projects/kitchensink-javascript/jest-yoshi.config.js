module.exports = {
  server: {
    command: 'node index.js',
    port: 3100,
  },
  e2eOptions: {
    globals: {
      foo: 'bar',
    },
  },
  specOptions: {
    globals: {
      foo: 'bar',
    },
  },
};
