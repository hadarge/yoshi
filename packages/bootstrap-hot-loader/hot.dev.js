const { Router } = require('express');

let context;
let router;
let wrappedFunction;

module.exports.hot = (sourceModule, _wrappedFunction_) => {
  // When HMR triggers `sourceModule` will be re-evaluated.
  //
  // That will trigger a call to this function, updating our
  // internal `wrappedFunction` with the new value.
  wrappedFunction = _wrappedFunction_;

  // Use `sourceModule`'s HMR API to accept changes for it
  // and the modules it depends on.
  //
  // https://webpack.js.org/concepts/hot-module-replacement
  if (sourceModule.hot) {
    sourceModule.hot.accept();

    if (sourceModule.hot.addStatusHandler) {
      if (sourceModule.hot.status() === 'idle') {
        sourceModule.hot.addStatusHandler(status => {
          if (status === 'apply') {
            // Updates the application state by invoking the new
            // `wrappedFunction` and creating a new `router`.
            setTimeout(async () => {
              try {
                router = await wrappedFunction(Router(), context);
              } catch (error) {
                console.log(error);
              }
            });
          }
        });
      }
    }
  }

  // Return a wrapped function for `wix-bootstrap-ng` to use.
  // Note that this function will only run once.
  return async (app, _context_) => {
    // Update the internal reference to `context`.
    context = _context_;

    // Run the user's code with an empty router.
    router = await wrappedFunction(Router(), context);

    // Return the original app but delegate to the router from the
    // user's code.
    //
    // When HMR triggers and the `router` reference is updated, this
    // app will start delegating to the new `router`.
    return app.use((req, res, next) => {
      router.handle(req, res, next);
    });
  };
};
