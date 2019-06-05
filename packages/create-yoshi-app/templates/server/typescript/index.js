const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  .config('dist/src/config')
  .express('dist/src/server')
  .start();
