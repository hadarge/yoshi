---
id: version-4
title: Version 4
sidebar_label: Version 4
---

Like any major release, Yoshi v4 comes with some breaking changes. It's recommended to go over them to make the migration go easily. If you encounter any problems, please [open an issue](https://github.com/wix/yoshi/issues/new/choose).

This is the migration guide from v3 to v4. If you're still using Yoshi v1 or v2, follow their respective migration guides ([v1](https://wix.github.io/yoshi/blog/2018/03/15/yoshi-2), [v2](https://wix.github.io/yoshi/blog/2018/06/3/yoshi-3)) first.

### Bump dependencies

Inside any Yoshi project, run:

```
npm install --save-dev yoshi@4
```

If you depend on [yoshi-style-dependencies](https://github.com/wix/yoshi/tree/version_4.x/packages/yoshi-style-dependencies), [yoshi-angular-dependencies](https://github.com/wix/yoshi/tree/version_4.x/packages/yoshi-angular-dependencies) or [jest-yoshi-preset](https://github.com/wix/yoshi/tree/version_4.x/packages/jest-yoshi-preset), make sure to bump them too:

```
npm install --save-dev yoshi-style-dependencies@4
```

And/or:

```
npm install --save-dev yoshi-angular-dependencies@4
```

And/or:

```
npm install --save-dev jest-yoshi-preset@4
```

**Finally, for TypeScript projects, Yoshi now requires TypeScript with a minimum version of 2.9.0.**

### Babel config is no longer needed

Previously, every project needed to configure their own Babel presets and rules. While giving projects flexibility, it created duplicated boilerplate and made it harder to create a good experience. Yoshi now configures Babel internally.

If your project is a Babel project, please make sure to remove your `.babelrc` file.

### `yoshi start` doesn't run tests by default

Jest is now the default test runner. Running its immersive watch mode along with `npm start` hides the dev server output. We recommend that you use `yoshi start` to start your local development environment and that you run your tests in a separate terminal.

If you're still interested in running your tests in the same terminal, use `yoshi start --with-tests`. Also, if you previously worked with `--no-tests`, just remove it.

### TypeScript definitions for Yoshi

Currently, every TypeScript project has to define build related types:

```js
// sass
declare module '*.scss';

// json
declare module '*.json';

// png
declare module '*.png';
```

Those types are defined as `any` and require the developer to add new ones when they use a new type of asset supported by Yoshi. Instead, Yoshi now supplies its own `types.d.ts` and each asset has its own type definition.

Then, change your `tsconfig.json`:

```diff
{
  "compilerOptions": {
-    "lib": ["dom", "es2016", "es2017"],
+    "lib": ["dom", "esnext"],
+    "resolveJsonModule": true,
    "..."
  },
  "files": [
+    "./node_modules/yoshi/types.d.ts",
    "..."
  ]
}
```

Finally, remove any old types you had on assets handled by Yoshi (normally in `src/external-types.d.ts`):

```diff
-declare module '*.scss';
-declare module '*.json';

interface Window {
  __BASEURL__: string;
}
```

### SVGs that are `require()`'d now has a `.default` property

Previously, we could `require` (this does not include using `import`) SVG files like this:

```js
const logo = require("./logo.svg");

const App = () => <img src={logo} />;
```

If you want to keep this specific use-case working, you'll need to update it like the following:

```js
const logo = require("./logo.svg");

const App = () => <img src={logo.default} />;
```

### Jest test files locations have been changed

(**Only relevant for projects using `jest-yoshi-preset`**)

We've changed the test file glob patterns to be more flexible:

- We recommend that you change the directory `test` -> `__tests__` which places it at the top and makes it easier to identify because of the `__` prefix and suffix.

- We changed the test setup to only have two environments instead of 3:

  - `e2e` - An environment that will start your server and a puppeteer page.
  - `spec` - An environment for running unit and component tests which set up JSDOM.

Files that end with `.e2e.(js|ts)` will use e2e environment, while files that end with `.spec.(js|ts)` will use spec environment, regardless of where in the project those files are in. We also changed the names and setup files so they don't collide with the new test extensions:

- `<rootDir>/test/setup.component.(j|t)s`: JSDOM (component)
- `<rootDir>/test/setup.server.(j|t)s`: Bootstrap (server)
- `<rootDir>/test/setup.e2e.(j|t)s`: Puppeteer (e2e)

Have changed to:

- `<rootDir>/__tests__/spec-setup.(j|t)s`: Setup for .spec tests (Component and Unit tests)
- `<rootDir>/__tests__/e2e-setup.(j|t)s`: Setup for .e2e tests (Browser an Server e2e tests)

To make migration easier, please start by running a helper script, which will change your project's files to the new glob patterns:

```
curl https://gist.githubusercontent.com/ronami/1608dc49efc166bb6e15a21f7073cb79/raw | node
```

**Note:** If you're using `MATCH_ENV=component` it should be replaced with `MATCH_ENV=spec`

### Puppeteer actions in Jest have a shorter default timeout

(**Only relevant for projects using `jest-yoshi-preset`**)

Normally, Jest E2E tests have a 10-second timeout. This means that if an async test did not finish in that time, it will count as a failing test. It will be difficult to know which async operation caused our test to fail, only that our test has failed because of a timeout.

We've noticed that in most cases, we hit this timeout when waiting for a Puppeteer operation (For example, calling `await page.waitForSelector('#unknown')`). This is because Puppeteer has a default timeout of 30 seconds. Combined with Jest's shorter 10 seconds timeout, we never reach it.

To help solve it, we've decided to change Puppeteer default timeout to 5 seconds.

If you have a specific operation that needs a longer timeout, simply pass a longer timeout for it:

```js
await page.waitForSelector("#longer", { timeout: 10000 });
```

See [Puppeteer's docs](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagesetdefaulttimeouttimeout) if you want to change this value back.

### `yoshi test` runs Jest by default

We want to encourage as many developers as possible to use Jest as their testing platform. From v4, running `yoshi test` will run Jest instead of Mocha and Protractor.

To use the previous default, make the following change (only if you're not using Jest):

```diff
-yoshi test
+yoshi test --mocha --protractor
```

### App flow

We recommend every app project (this includes client and full-stack apps, **but not libraries**) to start using this app flow. To migrate, please follow [this guide](../guides/app-flow.md).
