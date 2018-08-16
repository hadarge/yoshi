## 🤹 Jest yoshi preset

> Jest setup for Yoshi based projects

### Introduction

This preset configures Jest with 3 different environments ([learn more](https://jestjs.io/docs/en/configuration#testenvironment-string)). Each environment sets up its own globals and is configured to run for every file that matches a certain glob pattern ([learn more](https://github.com/isaacs/node-glob)).

### Usage

Install by running:

```bash
npm install --save-dev jest-yoshi-preset puppeteer jest
```

Add the following to your Jest config:

```json
{
    "preset": "jest-yoshi-preset"
}
```

### Environments

#### JSDOM environment

Sets up a standard [JSDOM](https://github.com/jsdom/jsdom) environment for component tests.

It's configured for every file under `<rootDir>/src/**/*.spec.js`.

#### Server environment

An environment for testing your server (API) code. It starts up a different instance of your server ([wix-ng-bootstarp based](https://github.com/wix-platform/wix-node-platform)) for every test file.

You sohuld define setup and teardown functions to start/stop your server and relevant mocks (learn more: [wix-bootstrap-testkit](https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-testkit), [wix-rpc-testkit](https://github.com/wix-platform/wix-node-platform/tree/master/rpc/wix-rpc-testkit)).


Runs for every test file matching `<rootDir>/test/server/**/*.spec.js`.

#### Puppeteer environment

An environment that pre-configures [Puppeteer](https://github.com/GoogleChrome/puppeteer) for running your E2E tests.

It creates a global Browser instance ([learn more](https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#class-browser)) and a global Page instance ([learn more](https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#class-page)) for every test file. They're available as `global.browser` and `global.page` respectively.

Runs for every file that matches `<rootDir>/test/e2e/**/*.spec.js`.

### Configuration

This preset looks for a `jest-yoshi.config.js` file at the root of your project. The exported object is used to configure different parts of the preset.

```js
module.exports = {
  bootstrap: {
    setup: async () => {},
    teardown: async () => {},
  },
  server: {
    command: 'node index.js',
    port: 1234,
  },
  puppeteer: {
    headless: true,
  },
};
```
