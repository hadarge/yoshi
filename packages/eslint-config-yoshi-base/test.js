module.exports = {
  env: {
    mocha: true,
    jasmine: true,
    protractor: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  overrides: [
    {
      files: ['**/*.spec.js', '**/*.test.js', '**/*.e2e.js', '**/*.it.js'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        // for chai expressions like "expect(...).to.be.undefined"
        // https://github.com/eslint/eslint/issues/2102
        'no-unused-expressions': 0,
      },
    },
  ],
};
