module.exports.localIdentName = {
  short: '[hash:base64:5]',
  long: '[path][name]__[local]__[hash:base64:5]',
};

// module.exports.unpkgDomain = 'https://static.parastorage.com/unpkg';

module.exports.PORT = parseInt(process.env.PORT, 10) || 3000;

module.exports.minimumNodeVersion = '8.7.0';
