/* global __resourceQuery */

if (module.hot) {
  const log = require('webpack/hot/log');
  const SockJS = require('sockjs-client');

  const port = __resourceQuery.substr(1);
  const socket = new SockJS(`http://localhost:${port}/_yoshi_server_hmr_`);

  socket.onmessage = function checkForUpdate(fromUpdate) {
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
          socket.send(JSON.stringify({ success: true }));
        })
        .catch(function(err) {
          const status = module.hot.status();
          if (['abort', 'fail'].indexOf(status) >= 0) {
            log('warning', '[HMR] Cannot apply update.');
            log('warning', '[HMR] ' + (err.stack || err.message));
            log('warning', '[HMR] Restarting the application!');

            // Inform the parent process (Yoshi) that HMR failed and the server
            // needs to be restarted
            socket.send(JSON.stringify({ success: false }));
          } else {
            log(
              'warning',
              '[HMR] Update failed: ' + (err.stack || err.message),
            );
          }
        });
    }
  };
} else {
  throw new Error('[HMR] Hot Module Replacement is disabled.');
}
