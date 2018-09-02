const bootstrap = require('wix-bootstrap-ng');

const app = bootstrap()
  .use(require('wix-bootstrap-greynode'))
  .use(require('wix-bootstrap-hadron'))
  .use(require('wix-bootstrap-renderer'));

// Our code needs to be transpiled with Babel or TypeScript. In production or locally we
// use the already transpiled code from the /dist directory.
//
// In tests we use require hooks to transpile our code on the fly. For more information on
// require hooks, see https://babeljs.io/docs/en/babel-register#compiling-plugins-and-presets-on-the-fly)
if (process.env.NODE_ENV === 'test') {
  app.express('./src/server');
} else {
  app.express('./dist/src/server');
}

app.start({
  disableCluster: process.env.NODE_ENV !== 'production',
});
