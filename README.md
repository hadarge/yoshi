# Yoshi

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Wix's toolkit to support building applications of different types.

* [Creating an App](#creating-an-app) - How to create a new app.
* [Basic Usage](#basic-usage) - How to use Yoshi.
* [User Guide](#user-guide) - How to develop apps bootstrapped with Yoshi.

If something doesnt work for you, please [file an issue](https://github.com/wix/yoshi/issues/new/choose).

## Creating an App

```sh
npx create-yoshi-app my-app
cd my-app
npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.

<p align='center'>
  <img src='https://yoshi-assets.surge.sh/create-yoshi-app.gif' alt='create-yoshi-app'>
</p>

## Basic Usage

### `npm start`
Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

### `npm test`
Runs your unit and e2e tests.<br>
Run `npm test --watch` to run the tests in watch mode.<br>

## User Guide
The User Guide includes information on different topics, such as:

- [Installing Yoshi without a generator](/docs/faq/YOSHI-SETUP.md)
- [CLI Documentation](/docs/faq/YOSHI-CLI.md)
- [API Documentation](/docs/faq/YOSHI-API.md)
- [Debugging local server or tests](/docs/faq/DEBUGGING.md)
- [Adding external assets to the client](docs/faq/ASSETS.md)
- [Hot Module Reloading](docs/faq/USING-HMR.md)
- [Yoshi's Babel Preset (babel-preset-yoshi)](packages/babel-preset-yoshi/README.md)
- [Setup Enzyme](docs/faq/SETUP-TESTING-WITH-ENZYME.md)
- [Exporting ES modules side-by-side with commonjs](docs/faq/EXPORT-MODULES.md)
- [Disabling CSS modules in specific places](docs/faq/DISABLE-SPECIFIC-CSS-MODULES.md)
- [Analyzing webpack bundle contents](docs/faq/WEBPACK-ANALYZE.md)
- [Bundling common logic for multiple entrypoints](docs/faq/SPLIT-CHUNKS.md)
- [Using SVG](docs/faq/SVG.md)
- [Moment.js locales](docs/faq/MOMENT_OPTIMIZATION.md)
- [Adding automatic AB tests to textual content (Wix Specific)](docs/faq/AB_TRANSLATE.md)
- [Project Examples for specific scenarios](https://github.com/wix-private/wix-js-stack/tree/master/examples) **Note:** These examples were generated with the old generators are currently unmaintained but can still be a good reference.
