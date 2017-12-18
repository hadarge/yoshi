const {migrate} = require('migrate-bower-artifactory');

module.exports = () => {
  return async () => migrate();
};
