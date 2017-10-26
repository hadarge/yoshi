Object.assign(process.env, {
  NODE_ENV: 'test',
  SRC_PATH: './src',
});

require('./test-setup');
