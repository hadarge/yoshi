const {migrate} = require('migrate-bower-artifactory');

module.exports = () => {
  return process.env.MIGRATE_BOWER_ARTIFACTORY_TOOL ?
    async () => migrate() :
    async () => null;
};
