# Haste preset yoshi

A Haste preset that supports building all kinds of applications in wix.

## Features
This preset mimics [Yoshi's](https://github.com/wix/yoshi#yoshi) behavior, every project that is driven by Yoshi can use this preset as a drop-in replacement.

In order to configure the preset go to [Yoshi's configuration guide](https://github.com/wix/yoshi#configurations)

## Requirements

- Node.js v8.9.1 or above

## Installation

```sh
$ npm install --save-dev haste-preset-yoshi
```

## Quickstart

Edit your project's package.json and add the yoshi preset to the haste config:

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

That's it, you can start working on your app by running one of the supported commands:

## `npm start`

Runs the app in dev mode, watching for file changes and updating the app in response. (also spawns `npm test` on watch mode)

## `npm test`

Runs all of your app's tests.

## `npm run build`

Builds your app for production. It bundles your client side code, minifies it and optimizes the build for the best performance.
