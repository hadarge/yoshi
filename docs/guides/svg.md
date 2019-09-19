---
id: svg
title: How to use SVG?
sidebar_label: How to use SVG?
---

There are few ways of using SVG:

- Just import it or use `background: url()` in your css and it will be inserted as data URI
- Call the svg file with "inline" suffix (i.e., "icon.inline.svg"), then import it and it will import optimized svg,
  which can be inserted to the DOM. Note: don't use this for react application, raw svg is not valid react code, use the next one.
- For react applications use https://github.com/wix/svg2react-icon – converts your svg into a react component.
- Starting from the v4, there is a handy way of working with SVGs – instead of running `svg2react-icon` as a pre-build step, you can now import SVGs directly as React components:
  ```
  import { ReactComponent as Logo } from "./logo.svg";
  const App = () => (
    <div>
      {/* Logo is an actual React component */}
      <Logo />
    </div>
  );
  ```
