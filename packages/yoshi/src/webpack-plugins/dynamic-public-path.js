module.exports = class DynamicPublicPath {
  constructor() {
    this._script =
      "__webpack_require__.p = typeof window !== 'undefined' && window.__STATICS_BASE_URL__ || __webpack_require__.p;";
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('DynamicPublicPath', compilation => {
      compilation.mainTemplate.hooks.startup.tap(
        'DynamicPublicPath',
        source => `${this._script}\n${source}`,
      );
    });
  }
};
