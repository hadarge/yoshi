module.exports = {
  rulesDirectory: ['tslint-plugin-prettier'],

  extends: ['tslint-config-yoshi-base', 'tslint-react'],

  rules: {
    // // https://github.com/palantir/tslint-react
    'jsx-no-lambda': false,
  },
};
