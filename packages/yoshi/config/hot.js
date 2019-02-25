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

          // Inform the parent process (Yoshi) that HMR was successful
          process.send({ success: true });
        })
        .catch(function(err) {
          const status = module.hot.status();
          if (['abort', 'fail'].indexOf(status) >= 0) {
            log('warning', '[HMR] Cannot apply update.');
            log('warning', '[HMR] ' + (err.stack || err.message));
            log('warning', '[HMR] Restarting the application!');

            // Inform the parent process (Yoshi) that HMR failed and the server
            // needs to be restarted
            process.send({ success: false });
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
