import 'regenerator-runtime/runtime';
import wixExpressCsrf from 'wix-express-csrf';
import wixExpressRequireHttps from 'wix-express-require-https';

module.exports = (app, context) => {
  const config = context.config.load('{%projectName%}');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(context.renderer.middleware());

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);
    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    return {
      locale: req.aspects['web-context'].language,
      basename: req.aspects['web-context'].basename,
      debug:
        req.aspects['web-context'].debug ||
        process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
};
