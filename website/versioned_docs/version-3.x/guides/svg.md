---
id: version-3.x-svg
title: How to use SVG?
sidebar_label: How to use SVG?
original_id: svg
---

There are few ways of using SVG:

- Just import it or use `background: url()` in your css and it will be inserted as data URI
- Call the svg file with "inline" suffix (i.e., "icon.inline.svg"), then import it and it will import optimized svg,
  which can be inserted to the DOM. Note: don't use this for react application, raw svg is not valid react code, use the next one.
- For react applications use https://github.com/wix/svg2react-icon – converts your svg into a react component.
