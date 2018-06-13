module.exports = {
  rulesDirectory: ['tslint-react'],

  extends: ['tslint-config-yoshi-base'],

  rules: {
    // https://github.com/palantir/tslint-react
    'jsx-no-bind': true,
    'jsx-no-string-ref': true,
  },
};
