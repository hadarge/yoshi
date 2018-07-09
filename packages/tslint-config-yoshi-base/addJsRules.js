function withoutKeys(obj, keys) {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((prev, key) => ({ ...prev, [key]: obj[key] }), {});
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
  'no-unused-variable',
  'strict-type-predicates',
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
];

module.exports = config => {
  return {
    ...config,
    jsRules: withoutKeys(config.rules, tsOnlyRules),
  };
};
