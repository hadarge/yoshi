const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  // https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-ng#wixbootstrapngconfigfileexportingfunction-this
  .config('dist/src/config')
  .express('dist/src/server')
  .start();
