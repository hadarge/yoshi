function withoutKeys(obj, keys) {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((prev, key) => Object.assign({}, prev, { [key]: obj[key] }), {});
}

const tsOnlyRules = [
  'adjacent-overload-signatures',
  'no-internal-module',
  'no-namespace',
  'no-non-null-assertion',
  'no-unnecessary-type-assertion',
  'await-promise',
  'no-floating-promises',
  'no-misused-new',
  'use-default-type-parameter',
  'prefer-readonly',
  'array-type',
  'callable-types',
  'interface-over-type-literal',
  'no-angle-bracket-type-assertion',
  'no-reference-import',
  'no-unnecessary-qualifier',
  'type-literal-delimiter',
  'no-banned-terms',
  'no-with-statement',

  // not a typescript specific rule
  // see https://github.com/wix/yoshi/pull/431 for more information
  'restrict-plus-operands',
];

module.exports = config => {
  return Object.assign({}, config, {
    jsRules: withoutKeys(config.rules, tsOnlyRules),
  });
};
