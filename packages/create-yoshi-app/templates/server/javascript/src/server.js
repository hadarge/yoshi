import 'regenerator-runtime/runtime';
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';

module.exports = (app, context) => {
  // the context object contains either the platform's bootstrap context or your app-specific context as returned from your 'src/config.js'
  // see more here https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-ng#context

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);

  app.get('/', (req, res) => {
    res.json({
      success: true,
      payload: 'Hello world!',
      petriScopes: context.petriScopes,
    });
  });

  return app;
};
