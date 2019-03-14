---
id: app-flow
title: App Flow
sidebar_label: App Flow
---

We want to deliver awesome developer experience, one that's specific to the type of application that you build.

App flow is an improved developer experience that is specific to apps. Internally, instead of running many different tools (babel/typescript, sass/less) on various glob patterns, it creates a dedicated Webpack bundle, specifically for the server.

This has a few advantages:

- **Clean output, clear errors:** If your build fails or your server throws you should know about it immediately and clearly. Forget of long stack traces or errors that show multiple times; See your server's output in your terminal.
- **Faster build times:** Now that Yoshi knows it targets apps, it can only run relevant build operations which can result in significant speed boost.
- **Faster server reload:** When you're working in watch mode and you change a file, Yoshi knows wether to reload your server, client or both. With the addition of **server-side HMR**, Yoshi will be able to reload your `wix-bootstrap-ng` server almost instantly.

In the future, we plan on providing many features specifically for apps. We want to encourge applications to use the new flow.

Watch [Ronen's talk](https://drive.google.com/file/d/1u05-l27kSY1l6YaSqScXNe2_Hp0V7gkh/view?t=17m58s) to see how it is to work with it.

![A terminal showing the new app flow](assets/24-app-flow.png)

The purpose of this document is to explain how to opt-into this new feature. See https://github.com/wix/yoshi/pull/586 for more information on the changes it introduces.

### Migration

Since we're no longer transpiling files separately with Babel or TypeScript, direct your `index.js` to the bundle of the server:

```diff
const bootstrap = require('@wix/wix-bootstrap-ng');

const app = bootstrap()
  .use(require('@wix/wix-bootstrap-greynode'))
  .use(require('@wix/wix-bootstrap-hadron'))
  .use(require('@wix/wix-bootstrap-renderer'));

-if (process.env.NODE_ENV === 'test') {
-  app.express('./src/server');
-} else {
-  app.express('./dist/src/server');
-}
+app.express('./dist/server');

app.start({
  disableCluster: process.env.NODE_ENV !== 'production',
});
```

We use Webpack to bundle our server code and it can't handle mixing `module.exports` and EcmaScript imports in the same file. To solve it, change your `server.js` file to use EcmaScript modules for both, importing and exporting:

```diff
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';

-module.exports = (app, context) => {
+export default (app, context) => {
  const config = context.config.load('{%projectName%}');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(context.renderer.middleware());

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);

    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
};
```

Finally, opt-into app flow by changing your `package.json` to include:

```diff
{
  "scripts": {
-   "start": "yoshi start --entry-point=index-dev.js"
+   "start": "yoshi start --server=index-dev.js"
  },
  "yoshi": {
+    "projectType": "app"
  }
}
```

If you're interested, opt-into hot module replacement for your server by installing:

```sh
npm i --save bootstrap-hot-loader
```

Then edit `server.js` with:

```diff
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';
+import { hot } from 'bootstrap-hot-loader';

-export default (app, context) => {
+export default hot(module, (app, context) => {
  const config = context.config.load('{%projectName%}');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(context.renderer.middleware());

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);

    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
-};
+});
```
