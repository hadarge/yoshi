# Changelog

# 2.0.0 (April 22, 2018)

## 2.0.0-rc.0 (April 18, 2018)
* :house_with_garden: Changes in the code structure, build configuration in CI and release script.

## 2.0.0-beta.3 (March 28, 2018)
* [#189](https://github.com/wix-private/yoshi/pull/189) Add `hmr: "auto"` option, which customizes [webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/) and [react-hot-loader](https://github.com/gaearon/react-hot-loader) automatically
* [#191](https://github.com/wix-private/yoshi/pull/191) Fix `test-setup` paths for wallaby configs
* [#187](https://github.com/wix-private/yoshi/pull/187) When compiling ES modules, move styles and assets to `es` directory.

## 2.0.0-beta.2 (March 19, 2018)
* **(Breaking)** Remove `haste` as a bin alias, from now on only `yoshi` would be valid bin. (for example `haste start` would not be supported, use `yoshi start` instead)

## 2.0.0-beta.1 (March 19, 2018)
* [#181](https://github.com/wix-private/yoshi/pull/181) Exclude the following tasks logs:
  1. `wixUpdateNodeVersion`
  2. `migrateScopePackages`
  3. `migrateBowerArtifactory`
  4. `wixDepCheck`
  5. `copy-server-assets`
  6. `copy-static-assets-legacy`
  7. `copy-static-assets`
  8. `maven-statics`
  9. `petri-specs`

* [#182](https://github.com/wix-private/yoshi/pull/182) Remove `yoshi-utils` as a dev dependency and replace with a local function
* [#183](https://github.com/wix-private/yoshi/pull/183) Copy `yoshi-runtime` package from original yoshi repository

## 2.0.0-beta.0 (March 15, 2018)
* [#178](https://github.com/wix-private/yoshi/pull/178) Add ES6 modules support

## 2.0.0-alpha.2 (March 6, 2018)
* [#171](https://github.com/wix-private/yoshi/pull/171) Update release script to support `old` npm dist-tag.
* [#172](https://github.com/wix-private/yoshi/pull/172) Add `yoshi.config.js` support.

## 1.2.0-alpha.1 (March 4, 2018)
  * [#169](https://github.com/wix-private/yoshi/pull/169) Add a custom publish script, the ci will automaticlly release after changing the version on `package.json`.
  * [#157](https://github.com/wix-private/yoshi/pull/157) Update webpack and related packages:
    * Bump loaders: [css-loader](https://github.com/webpack-contrib/css-loader), [resolve-url-loader](https://github.com/bholloway/resolve-url-loader), [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), [file-loader](https://github.com/webpack-contrib/file-loader) and [ts-loader](https://github.com/TypeStrong/ts-loader).
    * Replace [happypack](https://github.com/amireh/happypack) with [thread-loader](https://github.com/webpack-contrib/thread-loader) (since it's faster and compatible with webpack 4).
    * Rename `commonsChunk` to `splitChunks` to match webpack's naming.
    * Use `splitChunks.chunks: 'all'` by default (see more: [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)).
    * Disable [stylable-loader](github.com/wix/stylable-integration) (since it's incompatible with webpack 4).

## 1.2.1 (April 8, 2018)
start releasing on `yoshi` exclusively, update release script to publish one package, and updated relatived paths from `haste-preset-yoshi` to `yoshi`.

## 1.2.0 (April 3, 2018)
* [#194](https://github.com/wix-private/yoshi/pull/194) Stop saving webpack stats on start command

## 1.1.2 (March 27, 2018)
* [#168](https://github.com/wix-private/yoshi/pull/168) Set default formatter for tslint to `stylish` and add `--format` option for `lint` command.

## 1.1.0 (March 25, 2018)
* [#188](https://github.com/wix-private/yoshi/pull/188) Add option to only separate CSS on production

## 1.0.48 (March 21, 2018)
* [#143](https://github.com/wix-private/yoshi/pull/143) Add `stylable-integration` require-hooks and transform functions for testing environments (jest + mocha)

## 1.0.47 (March 7, 2018)
* [#176](https://github.com/wix-private/yoshi/pull/176) Adding `ts` files to the glob pattern provided by `debug/mocha`.

## 1.0.46 (March 7, 2018)
  * [#177](https://github.com/wix-private/yoshi/pull/177) Fix: Remove webpack output from `start` & `test` commands.

## 1.0.45 (February 21, 2018)
  * [#156](https://github.com/wix-private/yoshi/pull/156) Inline wix tasks instead of using them as external packages
  * [#154](https://github.com/wix-private/yoshi/pull/154) Add `wix-bootstrap-*` to depcheck task

## 1.0.44 (February 18, 2018)
  * Start of manual releases (see commit history for changes in previous versions of [yoshi](https://github.com/wix/yoshi))
