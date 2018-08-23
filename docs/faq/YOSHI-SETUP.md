# Yoshi Setup

## Requirements

- Node.js v8.9.1 or above

## Installation

```sh
npm install --save-dev yoshi
```

For Fullstack/Client applications:
- React:
  ```sh
  npm i --save-dev yoshi yoshi-style-dependencies
  ```
- Angular:
  ```sh
  npm i --save-dev yoshi yoshi-style-dependencies yoshi-angular-dependencies
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

See the [API Documentation](/docs/faq/YOSHI-API.md) for more configuration options.