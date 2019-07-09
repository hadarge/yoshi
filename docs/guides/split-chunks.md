---
id: split-chunks
title: Split Chunks
sidebar_label: Split Chunks
---

## How do I separately bundle common logic for multiple entries?

If you are using multiple entries you might consider using the [`yoshi.splitChunks`](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693), it will create a separate file (chunk) consisting of common modules shared between multiple entry points. This results in page speed optimizations as the browser can quickly serve the shared code from cache, rather than being forced to load a larger bundle whenever a new page is visited.

If you want to add it, go to your `package.json` and add the `commonChunks` option, the value can be a _boolean_ or an _object_.

```json
"yoshi": {
  "entry": {
    "a": "./a",
    "b": "./b",
  },
  "splitChunks": true
}
```

Insert `true` for the default configuration and an object for custom configuration, it is the same config you would normally insert to the plugin -> `optimization.splitChunks: <config>`

```json
// default configuration
{
  "chunks": "all",
  "name": "commons",
  "minChunks": 2
};
```

Once the plugin is active it will generate the following files if needed:

1. `commons.chunk.js`
2. `commons.chunk.min.js`
3. `commons.chunk.js.map`
4. `commons.css`
5. `commons.min.css`
6. `commons.css.map`

Don't forget to add them into your html file before the entry point.

```html
<script
  src="commons.chunk<% if (!debug) { %>.min<% } %>.js"
  charset="utf-8"
></script>
<script
  src="entry.bundle<% if (!debug) { %>.min<% } %>.js"
  charset="utf-8"
></script>
```

```html
<link
  rel="stylesheet"
  type="text/css"
  href="commons<% if (!debug) { %>.min<% } %>.css"
/>
<link
  rel="stylesheet"
  type="text/css"
  href="app<% if (!debug) { %>.min<% } %>.css"
/>
```

**Note:** since `1.1.0` version (webpack 4 support), if you're customizing `splitChunks` with _configuration object_, you should pass `splitChunks.chunks: "all" | "async" | "initial"` option.
Please look into [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693#configuration) to receive all advantage of webpack 4 `splitChunks` optimizations.

**Note 2:** consider chunk filename update after `1.1.0`: `chunk` instead of `bundle`:

```diff
- commons.bundle.js
+ commons.chunk.js
```
