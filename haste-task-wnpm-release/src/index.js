const wnpm = require('wnpm-ci');

module.exports = () => async () => {
  return new Promise(resolve =>
    wnpm.prepareForRelease({shouldShrinkWrap: false}, resolve)
  );
};
