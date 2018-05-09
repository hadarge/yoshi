# babel-preset-yoshi
Yoshi provides its own preset for full-stack, client or Node.js projects. It is pre-configured, maintained and tuned for the current state of Yoshi.

## Usages in Yoshi projects
Configure `yoshi` to use its built-in preset by adding the following to your `package.json`:

```json
{
  "babel": {
    "presets": ["yoshi"]
  }
}
```

## Wanna know what's inside?

- [preset-env](https://babeljs.io/docs/plugins/preset-env) for ESNext to ES5 transform. Moreover, you can customize current targets and module type to build for. Will use all targets and commonjs module type as a default values.
- [preset-react](https://babeljs.io/docs/plugins/preset-react) for JSX and Flow transforms.
- Stage 2 and 3 plugins: [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties), [transform-decorators](https://babeljs.io/docs/plugins/transform-decorators) (legacy).
- [remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types) only for production builds.
- [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import) - just syntax support since all transforms by webpack.

## Configuration options

- `targets`: Avoid redundant transformations if specified targets already support some of ESNext features. See more [preset-env#targets](https://babeljs.io/docs/plugins/preset-env/#targets). By default, if no `targets` provided, it will compile for **all** targets.
- `modules` (default: `"commonjs"`): Enable transformation of ES6 module syntax to another module type. See [preset-env#modules](https://babeljs.io/docs/plugins/preset-env/#modules). Set `false` to ignore module transforms.
- `ignoreReact` (default: `false`): ignores plugins and presets related to React.
- `debug` (default: `false`): Outputs the targets/plugins used according to specified targets. See [preset-env#debug](https://babeljs.io/docs/plugins/preset-env/#debug).
