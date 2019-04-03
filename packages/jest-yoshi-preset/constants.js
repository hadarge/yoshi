const { MATCH_ENV, LATEST_JSDOM } = process.env;

module.exports.envs = MATCH_ENV ? MATCH_ENV.split(',') : null;
module.exports.withLatestJSDom = LATEST_JSDOM;
