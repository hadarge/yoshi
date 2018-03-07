# Changelog

## 2.0.0-alpha.2 (March 6, 2018)
* [#171](https://github.com/wix-private/wix-haste/pull/171) Update release script to support `old` npm dist-tag.
* [#172](https://github.com/wix-private/wix-haste/pull/172) Add `yoshi.config.js` support.

## 1.2.0-alpha.1 (March 4, 2018)
  * [#169](https://github.com/wix-private/wix-haste/pull/169) Add a custom publish script, the ci will automaticlly release after changing the version on `package.json`.
  * [#157](https://github.com/wix-private/wix-haste/pull/157) Update webpack and related packages:
    * Bump loaders: [css-loader](https://github.com/webpack-contrib/css-loader), [resolve-url-loader](https://github.com/bholloway/resolve-url-loader), [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), [file-loader](https://github.com/webpack-contrib/file-loader) and [ts-loader](https://github.com/TypeStrong/ts-loader).
    * Replace [happypack](https://github.com/amireh/happypack) with [thread-loader](https://github.com/webpack-contrib/thread-loader) (since it's faster and compatible with webpack 4).
    * Rename `commonsChunk` to `splitChunks` to match webpack's naming.
    * Use `splitChunks.chunks: 'all'` by default (see more: [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)).
    * Disable [stylable-loader](github.com/wix/stylable-integration) (since it's incompatible with webpack 4).

## 1.0.46 (March 7, 2018)
  * [#177](https://github.com/wix-private/wix-haste/pull/177) Fix: Remove webpack output from `start` & `test` commands.

## 1.0.45 (February 21, 2018)
  * [#156](https://github.com/wix-private/wix-haste/pull/156) Inline wix tasks instead of using them as external packages
  * [#154](https://github.com/wix-private/wix-haste/pull/154) Add `wix-bootstrap-*` to depcheck task

## 1.0.44 (February 18, 2018)
  * Start of manual releases (see commit history for changes in previous versions of [yoshi](https://github.com/wix/yoshi))
