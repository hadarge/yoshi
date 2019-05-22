const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  .express('dist/src/server')
  .start();
