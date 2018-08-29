const bootstrap = require('wix-bootstrap-ng');

const app = bootstrap();

if (process.env.NODE_ENV === 'test') {
  app.express('./src/server');
} else {
  app.express('./dist/src/server');
}

app.start({
  disableCluster: process.env.NODE_ENV !== 'production',
});
