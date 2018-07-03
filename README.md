# Yoshi

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A Toolkit that supports building all kinds of applications in wix.

## Requirements

- Node.js v8.9.1 or above

## Installation

```sh
$ npm install --save-dev yoshi
```

## Quickstart

Configure `package.json` scripts,

> The following is a only a sample usage:

```js
{
"scripts": {
    "start": "yoshi start",
    "pretest": "yoshi lint && yoshi build",
    "test": "yoshi test",
    "build": ":",
    "release": "yoshi release" // only needed if you publish to npm
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
--ssl | | Serve the app bundle on https | false
--debug | | Allow server debugging, debugger will be available at 127.0.0.1:[port] | 0
--debug-brk | | Allow server debugging, debugger will be available at 127.0.0.1:[port], process won't start until debugger will be attached| 0
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
3. Add [Webpack stats](https://webpack.js.org/api/stats/) files to `target/`. Two files will be created: `target/webpack-stats.prod.json` and `target/webpack-stats.dev.json` for production and development builds respectively. These files can later be used for [bundle analysis](docs/faq/WEBPACK-ANALYZE.md).

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

**Note:** if you have multiple entries you should consider using the [`optimization.splitChunks`](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)

**Note2:** the decision whether to use `TypeScript` or `babel` is done by searching `tsconfig.json` inside the root directory.

### test

Flag | Description
---- | -----------
--mocha | Run unit tests with Mocha - this is the default
--jasmine | Run unit tests with Jasmine
--karma | Run tests with Karma (browser)
--jest | Run tests with Jest
--protractor | Run e2e tests with Protractor (e2e)
--watch | Run tests on watch mode (works for mocha, jasmine, jest & karma)
--debug | Allow test debugging (works for mocha, jest & protractor)
--debug-brk | Allow test debugging (works for mocha, jest & protractor), process won't start until debugger will be attached
--coverage | Collect and output code coverage

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
* Jest test setup:

  You may specify a jest config object in your `package.json`, for example:
  ```json
    "jest": {
      "testRegex": "/src/.*\\.spec\\.(ts|tsx)$"
    }
  ```

### lint

Flag | Short Flag | Description | Default Value
---- | ---------- | ----------- | ------------|
--fix | | Automatically fix lint problems | false
--format | | Use a specific formatter for eslint/tslint | stylish
[files...] | | Optional list of files (space delimited) to run lint on | empty

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

#### yoshi.splitChunks

Configure webpack's `optimization.splitChunks` option. It's an opt-in feature that creates a separate file (known as a chunk), consisting of common modules shared between multiple entry points.

Supports both `false` value *(default)*, `true` and a [configuration object](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693#configuration):

  ```json
  "yoshi": {
    "splitChunks": true
    }
  ```

#### yoshi.cssModules

We use [css modules](https://github.com/css-modules/css-modules) as default. You can disable this option any time by adding the following to wix section inside your `package.json`:

  ```json
  "yoshi": {
    "cssModules": false
  }
  ```

You also use the `prod` keyword to only separate css on CI and production, this is useful for speeding up HMR on local dev environments.

  ```json
  "yoshi": {
    "separateCss": "prod"
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
`Boolean` | `"auto"`

Set to `false` in order to disable hot module replacement. (defaults to true)

`"auto"` is an experimental feature which provides zero configuration HMR for react. It will include `react-hot-loader` to the top of the entry file and will wrap React's root component in special Higher Order Component which enables hot module reload for react. Also it will call `module.hot.accept` on the project's entry file.

##### yoshi.liveReload
`Boolean`

If true, instructs the browser to physically refresh the entire page if / when webpack indicates that a hot patch cannot be applied and a full refresh is needed.

#### yoshi.performance

Allows to use the Webpack Performance Budget feature.
The configuration object is the same as in webpack.
For more info, you can read the [webpack docs](https://webpack.js.org/configuration/performance/).

#### yoshi.resolveAlias

Allows you to use the Webpack Resolve Alias feature.
The configuration object is the same as in Webpack, note that the paths are relative to Webpacks context.
For more info, you can read the [webpack docs](https://webpack.js.org/configuration/resolve/#resolve-alias).

## FAQ
- [How do I debug my server/tests?](/docs/faq/DEBUGGING.md)
- [How to add external assets to my client part of the project?](docs/faq/ASSETS.md)
- [How to use HMR? And how to customize React project to use it?](docs/faq/USING-HMR.md)
- [How to add and use babel-preset-yoshi?](packages/babel-preset-yoshi/README.md)
- [How do I setup Enzyme test environment?](docs/faq/SETUP-TESTING-WITH-ENZYME.md)
- [How to export ES modules along with commonjs?](docs/faq/EXPORT-MODULES.md)
- [How to disable css modules in specific places](docs/faq/DISABLE-SPECIFIC-CSS-MODULES.md)
- [How to I analyze my webpack bundle contents](docs/faq/WEBPACK-ANALYZE.md)
- [How do I separately bundle common logic for multiple entries?](docs/faq/SPLIT-CHUNKS.md)
- [How to use SVG](docs/faq/SVG.md)
- [Moment.js locales are missing](docs/faq/MOMENT_OPTIMIZATION.md)
- [How do I add automatic AB tests to textual content?](docs/faq/AB_TRANSLATE.md)
