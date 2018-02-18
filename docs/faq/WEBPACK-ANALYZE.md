# How do I analyze my webpack bundle contents

__You can do one of the following:__

1. use the built in webpack-bundle-analyzer by adding the `analyze` option to the build command:
```bash
haste build --analyze
```
2. upload the `webpack-stats.prod.json` file to a website:
  - Go to https://chrisbateman.github.io/webpack-visualizer/
  - Drag `target/webpack-stats.prod.json` from your project and drop in browser page for analysis.

3. use the CLI with the `webpack-stats.prod.json`: try https://github.com/robertknight/webpack-bundle-size-analyzer

4. Use the webpack bundle analyzer page:
  - Go to https://webpack.github.io/analyse/
  - Upload `target/webpack-stats.prod.json` from your project
