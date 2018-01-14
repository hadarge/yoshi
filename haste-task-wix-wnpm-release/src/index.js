const wnpm = require('wnpm-ci');

module.exports = () => {
  return new Promise(resolve =>
    wnpm.prepareForRelease({shouldShrinkWrap: false}, resolve)
  );
};
