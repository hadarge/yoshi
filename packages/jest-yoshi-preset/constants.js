const { MATCH_ENV } = process.env;

module.exports.envs = MATCH_ENV ? MATCH_ENV.split(',') : null;
