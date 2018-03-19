const {isProduction, isCI} = require('./utils');
const genericNames = require('generic-names');
const path = require('path');

const patterns = module.exports.patterns = {
  long: '[path][name]__[local]__[hash:base64:5]',
  short: '[hash:base64:5]'
};

const isLongCSSFT = process.env.LONG_CSS_PATTERN === 'true';

const cssModulesPattren = module.exports.cssModulesPattren = () =>
  ((isProduction() || isCI()) && !isLongCSSFT) ? patterns.short : patterns.long;

module.exports.wixCssModulesRequireHook = (rootDir = './dist/src', customConfig = {}) => {
  require('css-modules-require-hook')(Object.assign({
    rootDir,
    generateScopedName: (name, filepath) => {
      let context = rootDir;
      if (filepath.indexOf('/node_modules/') > -1) {
        context = context.replace('/src', '');
      }
      const hashPrefix = require(path.resolve('package.json')).name;
      const generate = genericNames(cssModulesPattren(), {context, hashPrefix});
      return generate(name, filepath);
    },
    extensions: ['.scss', '.css', '.less', '.sass'],
    camelCase: true
  }, customConfig));
};
