module.exports.localIdentName = {
  short: '[hash:base64:5]',
  long: '[path][name]__[local]__[hash:base64:5]',
};

// module.exports.unpkgDomain = 'https://static.parastorage.com/unpkg';

module.exports.PORT = parseInt(process.env.PORT, 10) || 3000;

module.exports.SENTRY_DSN =
  'https://9325f661ff804c4a94c48e8c2eff9149@sentry.io/1292532';
