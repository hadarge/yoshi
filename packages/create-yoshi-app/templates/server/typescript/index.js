const path = require('path');
const bootstrap = require('@wix/wix-bootstrap-ng');

const src = path.join('.', 'dist', 'src');
const server = path.join(src, 'server');

bootstrap()
  .express(server)
  .start({ disableCluster: process.env.NODE_ENV === 'development' });
