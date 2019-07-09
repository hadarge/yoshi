---
id: hmr
title: HMR
sidebar_label: HMR
---

HMR is a way to speed up development built with webpack. You could retain local state of your application after each time the code was changed, save some time and allow your bundler to update only needed modules, tweak styling, etc.

## `hmr: true` (default)

In most cases enabling it in the config is not enough.
[You should configure it in a proper way](https://webpack.js.org/api/hot-module-replacement/)

Moreover, for React application you should also use [react-hot-loader](https://github.com/gaearon/react-hot-loader) with `react-hot-loader/babel` plugin:

1. Add react-hot-loader/babel to your babel config:

```json
"plugins": ["react-hot-loader/babel"]
```

2. Wrap your root component into `hot` HOC:

_App.js_

```js
import { hot } from "react-hot-loader";
const App = () => <div>Hello World!</div>;

export default hot(module)(App);
```

_index.js_

```js
import { render } from "react-dom";
import App from "./App";

render(App, rootEl);
```

3. Run `yoshi start`

For more info read [react-hot-loader documentation](https://github.com/gaearon/react-hot-loader#install).

## `hmr: "auto"`

You can configure hmr manually, according to the steps above, or you can use the new experimental feature `hmr: "auto"`.

> Note: This feature is available since yoshi 2

Just add this option to your config and yoshi will provide the transformations needed for your entry files to make HMR work in a correct way.

During `yoshi start` command it will [add `babel-plugin-transform-hmr-runtime`](https://github.com/wix/yoshi/pull/189). This plugin will add `react-hot-reload` to your imports, check `import`ed `from 'react-dom'` `render` method and try to wrap your root Component into special Higher Order Component provided by `react-hot-reload`.
It also adds:

```js
if (module.hot) {
  module.hot.accept();
}
```

to your entry files and initializes HMR.

## `hmr: false`

Using this option, you opt out from using hot module replacement.

**NOTE:** If you want to also opt out from `liveReload` configure `{ liveReload: false }` in your yoshi config.

### Caveats:

- It does not work yet with `render(React.createElement('div'), el)`. Just with JSX elements. But we are working on this.
- Despite that it isn't somehow affect production, it's not stable yet. So you could try it and [open an issue](https://github.com/wix/yoshi/issues) in case of bugs. 🙏
