module.exports = () => ({
  loader: 'thread-loader',
  options: {
    workers: require('os').cpus().length - 1,
  },
});
