---
id: version-4.x-app-flow
title: App Flow
sidebar_label: App Flow
original_id: app-flow
---

We want to deliver awesome developer experience, one that's specific to the type of application that you build.

App flow is an improved developer experience that is specific to apps. Internally, instead of running many different tools (babel/typescript, sass/less) on various glob patterns, it creates a dedicated Webpack bundle, specifically for the server.

This has a few advantages:

- **Clean output, clear errors:** If your build fails or your server throws you should know about it immediately and clearly. Forget of long stack traces or errors that show multiple times; See your server's output in your terminal.
- **Faster build times:** Now that Yoshi knows it targets apps, it can only run relevant build operations which can result in a significant speed boost.
- **Faster server reload:** When you're working in watch mode and you change a file, Yoshi knows whether to reload your server, client or both. With the addition of **server-side HMR**, Yoshi will be able to reload your `wix-bootstrap-ng` server almost instantly.

In the future, we plan on providing many features specifically for apps. We want to encourage applications to use the new flow.

![A terminal showing the new app flow](../assets/24-app-flow.png)

The purpose of this document is to explain how to opt-into this new feature. See https://github.com/wix/yoshi/pull/586 for more information on the changes it introduces.

### Migration for Fullstack apps (bootstrap)

Start by opting into app flow by changing your `package.json` or `yoshi.config.js` to include:

```diff
{
  "yoshi": {
+    "projectType": "app"
  }
}
```

Since we now have one bundle for the server, we'll direct Bootstrap's express app to `dist/server.js` file. Edit `index.js` with:

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

app.start();
```

We use Webpack to bundle our server code and it can't handle mixing `module.exports` and ECMAScript imports in the same file. To solve it, change your `server.js` file to use EcmaScript modules for both, importing and exporting:

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

We use `source-map-support` internally so stack traces show locations in your source files. To work in production (with New Relic monitoring), please install `source-map-support` under `dependencies`:

```
npm i --save source-map-support
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

### Migration for Client apps

Start by opting into app flow by changing your `package.json` or `yoshi.config.js` to include:

```diff
{
  "yoshi": {
+    "projectType": "app"
  }
}
```

In app flow, Yoshi looks for the entry file of your server at `/dev/server.(js|ts)`. Move your current local dev server to that location. For example, if your local dev server is in `index.js`:

```
mkdir dev
mv index.js dev/server.js
```

With that, Yoshi will now bundle it into `/dist/server.js`.

Finally, adjust your `package.json` to run it:

```diff
{
  "scripts": {
+    "start": "yoshi start --entry-point=dist/server.js"
-    "start": "yoshi start"
  }
}
```

### Scripts

These are the scripts that are available to you in a project that uses app flow:

#### `npx yoshi start`

Starts the application in development mode. Runs your application server and `webpack-dev-server` on port 3200. Watches for changes and reloads your app automatically. Compilation errors will show both, in the terminal and in the browser.

Possible flags:

- `--server`: By default, starts your application server by running `index.js`. Pass a different value to start up a different script.
- `--https`: Start `webpack-dev-server` with HTTPS. Note that it will only affect `webpack-dev-server` and not your application server.
- `--url`: By default, opens your browser with `http://localhost:3000`. Use this to pass a different URL.
- `--production`: Start using un-minified production build.
- `--debug`: Pass this flag to run your application server with a debugger.

#### `npx yoshi test`

Runs your test with the configured test runner (Jest by default). Pass `--watch` to start it in watch mode.

#### `npx yoshi build`

Builds your app for production into the `/dist` directory. Normally, this command will only run in CI. Client-side assets will be minified.

Possible flags:

- `--analyze`: Analyze production bundle. This is helpful to understand what is included in the bundle.
- `--stats`: Generate Webpack stats into `dist/webpack-stats.json`.
