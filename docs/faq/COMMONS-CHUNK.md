# How do I separetly bundle common logic for multiple entries?

If you are using multiple entries you might consider using the [commonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/), it will create a seperate file (chunk) consisting of common modules shared between multiple entry points. This results in pagespeed optimizations as the browser can quickly serve the shared code from cache, rather than being forced to load a larger bundle whenever a new page is visited.

If you want to add it, go to your `package.json` and add the `commonChunks` options, the value can be a boolean or an object.


```json
"yoshi": {
  "entry": {
    "a": "./a",
    "b": "./b",
  },
  "commonsChunk": true
}
```

Insert `true` for the default configuration and an object for custom configuraion, it is the same object you would normaly insert to the plugin -> `new webpack.optimize.CommonsChunkPlugin(<this object>)`

```json
// the default configuration

{
  "name": "commons",
  "minChunks": 2
};
```

Once the plugin is active it will generate the following files if needed:
1. commons.bundle.js
2. commons.bundle.min.js
3. commons.bundle.js.map
4. commons.css
5. commons.min.css
6. commons.css.map

Don't forget to add them into your html file before the entry point.

```html
<script src="commons.bundle<% if (!debug) { %>.min<% } %>.js" charset="utf-8"></script>
<script src="entry.bundle<% if (!debug) { %>.min<% } %>.js" charset="utf-8"></script>
```

```html
<link rel="stylesheet" type="text/css" href="commons<% if (!debug) { %>.min<% } %>.css" />
<link rel="stylesheet" type="text/css" href="app<% if (!debug) { %>.min<% } %>.css" />
```