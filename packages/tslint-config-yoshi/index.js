const addJsRules = require('tslint-config-yoshi-base/addJsRules');

module.exports = addJsRules({
  rulesDirectory: ['tslint-react'],

  extends: [
    'tslint-react',
    'tslint-config-yoshi-base',
    'tslint-plugin-wix-style-react',
  ],

  rules: {
    // https://github.com/palantir/tslint-react
    'jsx-boolean-value': false,
    'jsx-key': true,
    'jsx-no-bind': true,
    'jsx-no-lambda': false,
    'jsx-no-string-ref': true,
    'jsx-self-close': false,

    // https://github.com/wix/wix-ui/tree/master/packages/tslint-plugin-wix-style-react
    'no-full-wsr-lib': true,
  },
});
