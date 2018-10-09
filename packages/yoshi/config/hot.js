if (module.hot) {
  const log = require('webpack/hot/log');

  const checkForUpdate = function checkForUpdate(fromUpdate) {
    if (module.hot.status() === 'idle') {
      module.hot
        .check(true)
        .then(function(updatedModules) {
          if (!updatedModules) {
            if (fromUpdate) log('info', '[HMR] Update applied.');
            return;
          }
          require('webpack/hot/log-apply-result')(
            updatedModules,
            updatedModules,
          );
          checkForUpdate(true);
        })
        .catch(function(err) {
          const status = module.hot.status();
          if (['abort', 'fail'].indexOf(status) >= 0) {
            log('warning', '[HMR] Cannot apply update.');
            log('warning', '[HMR] ' + (err.stack || err.message));
            log('warning', '[HMR] Restarting the application!');

            // Send an empty message to the parent process (Yoshi) to restart
            // the application
            process.send({});
          } else {
            log(
              'warning',
              '[HMR] Update failed: ' + (err.stack || err.message),
            );
          }
        });
    }
  };

  process.on('message', checkForUpdate);
} else {
  throw new Error('[HMR] Hot Module Replacement is disabled.');
}
