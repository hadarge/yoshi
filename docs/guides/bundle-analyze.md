---
id: bundle-analyze
title: Analyze Your Bundle
sidebar_label: Analyze Your Bundle
---

Running `yoshi` with the `--stats` flag:

```bash
yoshi build --stats
```

Will generate a webpack profiling file in `target/webpack-stats.json`

**You can do one of the following:**

1. use the built in webpack-bundle-analyzer by adding the `analyze` option to the build command:

```bash
yoshi build --analyze
```

2. upload the `webpack-stats.json` file to a website:

- Go to https://chrisbateman.github.io/webpack-visualizer/
- Drag `target/webpack-stats.json` from your project and drop in browser page for analysis.

3. use the CLI with the `webpack-stats.json`: try https://github.com/robertknight/webpack-bundle-size-analyzer

4. Use the webpack bundle analyzer page:

- Go to https://webpack.github.io/analyse/
- Upload `target/webpack-stats.json` from your project
