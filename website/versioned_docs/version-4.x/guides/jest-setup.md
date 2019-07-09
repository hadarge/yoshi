---
id: version-4.x-jest-setup
title: Jest Setup
sidebar_label: Jest Setup
original_id: jest-setup
---

## Introduction

Yoshi defines a custom [Jest preset](https://jestjs.io/docs/en/configuration#preset-string) to enable zero-configuration testing for most apps.

This preset configures Jest with 2 different project types ([learn more](https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig)), each project uses a unique environment ([learn more](https://jestjs.io/docs/en/configuration#testenvironment-string)). Each environment sets up its own globals and is configured to run for every file that matches a certain glob pattern ([learn more](https://github.com/isaacs/node-glob)).

## Installation

```bash
npm install --save-dev jest-yoshi-preset puppeteer
```

Add the following to your Jest config:

```json
{
  "preset": "jest-yoshi-preset"
}
```

> If you're using TypeScript you should add `jest-yoshi-preset` types to your code by adding the following to your `tsconfig.json`:

```json
{
  "files": ["./node_modules/jest-yoshi-preset/types.d.ts"]
}
```

## Usage

### Dev mode

Use the `start` command to build and serve your bundle and static files, your `e2e` tests require them.

```sh
yoshi start
```

From a different terminal window, use `npx jest` command normally.

Run a specific test

```shell
npx jest my-specific-test
```

Run all tests of a specific type (different [jest project](https://jestjs.io/docs/en/configuration#projects-array-string-projectconfig)).

You can filter the tests using the display name (`e2e`, `spec`)

For example, running only e2e tests:

```shell
MATCH_ENV=e2e npx jest
```

Run jest using watch mode

```shell
npx jest --watch
```

### CI mode

> You can also use this mode locally

In this mode, your tests will run against you local `dist/statics` directory.

```shell
npx yoshi test
```

Yoshi serves the files from `dist/statics`. Make sure to run `npx yoshi build` before you run the tests using this mode.

## Test types

### Component and Unit tests

Run against all `.spec.js` or `.spec.ts` files. [JSDOM](https://github.com/jsdom/jsdom) environment is included.

### Browser and Server e2e tests

Run against all `.e2e.js` or `.e2e.ts` files. Starts up a [bootstrap server](https://github.com/wix-platform/wix-node-platform) instance and creates a [Puppeteer](https://github.com/GoogleChrome/puppeteer) page for that test.

It creates a global [Browser](https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#class-browser) instance and a global [Page](https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#class-page) instance for every test file. They're available as `global.browser` and `global.page` respectively.

Has a default test timeout of 10 seconds.

## Configuration

This preset looks for a `jest-yoshi.config.js` file at the root of your project. The exported object is used to configure different parts of the preset.

example configurations:

- [fullstack project](https://github.com/wix/yoshi/blob/master/packages/create-yoshi-app/templates/fullstack/typescript/jest-yoshi.config.js)
- [client project](https://github.com/wix/yoshi/blob/master/packages/create-yoshi-app/templates/client/typescript/jest-yoshi.config.js)

```js
module.exports = {
  bootstrap: {
    // environment setup function which called before each test file
    setup: async ({ globalObject }) => {},
    // environment teardown function which called after each test file
    teardown: async ({ globalObject }) => {}
  },
  server: {
    // runs a command which bootstrap the server
    command: "node server.js",
    // wait for a server to start listening on this port before running the tests
    // this port will be available in you server script as an environment variable (PORT)
    port: 3000
  },
  puppeteer: {
    // toggle headless chrome mode
    headless: true
  }
};
```

### Setup Files

If you want to run some code before your tests you can use one of the 2 following setup files (1 for each environment):

- `<rootDir>/__tests__/spec-setup.(j|t)s`: Setup for `.spec` tests (Component and Unit tests)
- `<rootDir>/__tests__/e2e-setup.(j|t)s`: Setup for `.e2e` tests (Browser an Server e2e tests)

These setup files are actually [Jests's `setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array)

> A path to a module that runs some code to configure or set up the testing framework before each test.
