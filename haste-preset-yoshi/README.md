# Haste preset yoshi

A Haste preset that supports building all kinds of applications in wix.

## Features
This preset mimics [Yoshi's](https://github.com/wix/yoshi#yoshi) behavior, every project that is driven by Yoshi can use this preset as a drop-in replacement.

## Requirements

- Node.js v8.9.1 or above

## Installation

```sh
$ npm install --save-dev haste-preset-yoshi
```

## Quickstart

Edit your project's `package.json` and add the yoshi preset to the haste config:

```json
{
  "haste": {
    "preset": "yoshi"
  }
}
```

Configure `package.json` scripts,

> The following is a only a sample usage:

```js
{
"scripts": {
    "start": "haste start",
    "pretest": "haste lint && haste build",
    "test": "haste test",
    "build": ":",
    "release": "haste release" // only needed if you publish to npm
  }
}
```
Make sure your node version is above 8.9.1

```
// .nvmrc

8.9.1
```

## CLI

The following sections describe the available tasks in `yoshi`. You can always use the `--help` flag for every task to see its usage.

### start

Flag | Short Flag | Description | Default Value
---- | ---------- | ----------- | --------------
--entry-point | -e | Entry point for the app. | `./dist/index.js`
--manual-restart | | Get SIGHUP on change and manage application reboot manually | false
--no-test | | Do not spawn `npm test` after start | false
--no-server | | Do not spawn the app server | false

This will run the specified (server) `entryPoint` file and mount a CDN server.

The following are the default values for the CDN server's port, mount directory and whether to serve statics over https or regular http. You can change them in your `package.json`:

```json
"yoshi": {
  "servers": {
    "cdn": {
      "port": 3200,
      "dir": "dist/statics",
      "ssl": false
    }
  }
}
```

### build

Flag | Short Flag | Description | Default Value
---- | ---------- | ----------- | ------------
--output <dir> | | The output directory for static assets. | `statics`
--analyze | | run webpack-bundle-analyzer plugin. |

This task will perform the following:

1. Compile using `TypeScript` (`*.ts`) or `babel` (`*.js`) files into `dist/`. In case you do not want to transpile server (node), you can remove `.babelrc`/`tsconfig`/package json's `babel` key. If you still need those (for transpiling client code), please use `yoshi.runIndividualTranspiler`.
2. Copy assets to `dist` folder (ejs/html/images...).

You can specify multiple entry points in your `package.json` file. This gives the ability build multiple bundles at once. More info about Webpack entries can be found [here](http://webpack.github.io/docs/configuration.html#entry).

```json
"yoshi": {
  "entry": {
    "a": "./a",
    "b": "./b",
    "c": ["./c", "./d"]
  }
}
```

**Note:** if you have multiple entries you should consider using the [Commons Chunk Plugin](docs/faq/COMMONS-CHUNK.md)

**Note2:** the decision whether to use `TypeScript` or `babel` is done by searching `tsconfig.json` inside the root directory.

### test

Flag | Description
---- | -----------
--mocha | Run unit tests with Mocha - this is the default
--jasmine | Run unit tests with Jasmine
--karma | Run tests with Karma (browser)
--jest | Run tests with Jest
--protractor | Run e2e tests with Protractor (e2e)

By default, this task executes both unit test (using `mocha` as default) and e2e test using `protractor`.
Default unit test glob is `{test,app,src}/**/*.spec.+(js|ts)`. You can change this by adding the following to your package.json:

```js
yoshi: {
  specs: {
    node: 'my-crazy-tests-glob-here'
  }
}
```

* Note that when specifying multiple flags, only the first one will be considered, so you can't compose test runners (for now).

* Mocha tests setup:

  You can add a `test/mocha-setup.js` file, with mocha tests specific setup. Mocha will `require` this file, if exists.
  Example for such `test/mocha-setup.js`:

  ```js
  import 'babel-polyfill';
  import 'isomorphic-fetch';
  import sinonChai from 'sinon-chai';
  import chaiAsPromised from 'chai-as-promised';
  import chai from 'chai';

  chai.use(sinonChai);
  chai.use(chaiAsPromised);
  ```

* Karma tests setup:

  When running tests using Karma, make sure you have the right configurations in your `package.json` as described in [`yoshi.specs`](#wixspecs) section. In addition, if you have a `karma.conf.js` file, the configurations will be merged with our [built-in configurations](yoshi/config/karma.conf.js).
* Jasmine tests setup:

  Specifying a custom glob for test files is possible by configuring `package.json` as described in [`yoshi.specs`](#wixspecs). The default glob matches `.spec.` files in all folders.
  <br />
  If you wish to load helpers, import them all in a file placed at `'test/setup.js'`.

### lint

Flag | Short Flag | Description
---- | ---------- | -----------
--fix | | Automatically fix lint problems (works only for eslint)

Executes `TSLint` or `ESLint` (depending on the type of the project) over all matched files. An '.eslintrc' / `tslint.json` file with proper configurations is required.

### release

Bump `package.json` version and publish to npm using `wnpm-release`.

---

## Configurations

Configurations are meant to be inside `package.json` under `yoshi` section or by passing flags to common tasks.

#### yoshi.separateCss

By default, your `require`d css will bundled to a separate `app.css` bundle. You can leave your css in main js bundle by adding the following to your `package.json`:

  ```json
  "yoshi": {
    "separateCss": false
  }
  ```

#### yoshi.cssModules

We use [css modules](https://github.com/css-modules/css-modules) as default. You can disable this option any time by adding the following to wix section inside your `package.json`:

  ```json
  "yoshi": {
    "cssModules": false
  }
  ```

  Disabling cssModules on a specific css file is possible by adding `.global` before file extention.
  For example:

  `./Counter.global.scss` //no css modules for this file

  Using css modules inside your component is easy:

  ```js
  import s from './Counter.scss';//import css/scss

  <p className={s.mainColor}>{counterValue}</p>
  ```

  Using css when css modules are turned off:

  ```js
  import './Counter.scss';//import css/scss

  <p className="mainColor">{counterValue}</p>
  ```

#### yoshi.entry

Explanation is in [cli/build](#build) section.

#### yoshi.servers.cdn

Explanation is in [cli/start](#start) section.

#### yoshi.externals

Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime (as a script tags)

```json
{
  "yoshi": {
    "externals": {
      "react": "React"
    }
  }
}
```

#### yoshi.specs

Specs globs are configurable. `browser` is for karma, `node` is for mocha and jasmine.

```json
{
  "yoshi": {
    "specs": {
      "browser": "dist/custom/globs/**/*.spec.js",
      "node": "dist/custom/globs/**/*.spec.js"
    }
  }
}
```

For example:

```json
{
  "yoshi": {
    "specs": {
      "browser": "dist/src/client/**/*.spec.js",
      "node": "dist/src/server/**/*.spec.js"
    }
  }
}
```

#### yoshi.runIndividualTranspiler

In case you don't want to transpile your server (node) code, and you still need `.babelrc`/`tsconfig`, you can add `runIndividualTranspiler` flag to skip server transpiling.

#### yoshi.externalUnprocessedModules

You can explicitly ask build process to transpile some node modules in case those modules do not contain transpiled code.
Note that this is not a recommended workflow. It can be very error prone:
 1. It might be for example that your app babel config and the node module babel config will be conflicting.
 2. Any babel plugin that is used by your dependencies will need to be installed by your app as well.
 3. You'll need to also add nested dependencies that need transpiling into array, which can be confusing.

Anyway, if you don't have a better alternative you can pass array with module names in this property.

#### yoshi.exports

If set, export the bundle as library. `yoshi.exports` is the name.

Use this if you are writing a library and want to publish it as single file. Library will be exported with `UMD` format.

##### yoshi.hmr

Set to false in order to disable hot module replacement. (defaults to true)

## FAQ
- [How do I debug my application/tests?](https://github.com/wix-private/fed-handbook/blob/master/DEBUGGING.md)
- [How to add external assets to my client part of the project?](docs/faq/ASSETS.md)
- [How do I setup Enzyme test environment?](docs/faq/SETUP-TESTING-WITH-ENZYME.md)
- [How to disable css modules in specific places](docs/faq/DISABLE-SPECIFIC-CSS-MODULES.md)
- [How to I analyze my webpack bundle contents](docs/faq/WEBPACK-ANALYZE.md)
- [How do I separately bundle common logic for multiple entries?](docs/faq/COMMONS-CHUNK.md)
- [How to use SVG](docs/faq/SVG.md)
- [Moment.js locales are missing](docs/faq/MOMENT_OPTIMIZATION.md)
