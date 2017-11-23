# Haste preset yoshi

A Haste preset that supports building all kinds of applications in wix.

## Features
This preset mimics [Yoshi's](https://github.com/wix/yoshi#yoshi) behavior, every project that is driven by Yoshi can use this preset as a drop-in replacement.

In order to configure the preset go to [Yoshi's configuration guide](https://github.com/wix/yoshi#configurations)

## Requirements

- Node.js v8.7.0 or above

## Installation

```sh
$ npm install --save-dev haste-cli haste-preset-yoshi
```

## Quickstart

Edit your project's package.json and add commands for starting, building and testing your application:

```json
{
  "scripts": {
    "start": "haste start",
    "test": "haste test",
    "build": "haste build"
  },
  "haste": {
    "preset": "yoshi"
  }
}
```

Make sure your node version is above 8.7

```
// .nvmrc

8.9.1
```

That's it, you can start working on your app by running one of the supported commands: `start`, `test` or `build`.

## `npm start`

Runs the app in dev mode, watching for file changes and updating the app in response. (also spawns `npm test` on watch mode)

## `npm test`

Runs all of your app's tests with Jest. Supports a `--watch` flag to watch for file changes and run again.

## `npm build`

Builds your app for production. It bundles your client side code, minifies it and optimizes the build for the best performance.

## Configuration

You can provide custom configuration for the preset adding a `haste` field in your `package.json` or by creating a `.hasterc` file.
