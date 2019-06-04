const openBrowser = require('react-dev-utils/openBrowser');

// our own implementation of open browser which accepts more than one url
//
// url can be a string
// https://localhost:3000
//
// url can be a string of urls separated by commas
// https://localhost:3000, https://localhost:3001
//
// url can be a list of strings
// ['https://localhost:3000', 'https://localhost:3001']
module.exports = arg => {
  let urlsList;

  if (Array.isArray(arg)) {
    urlsList = arg;
  } else {
    if (arg.indexOf(',') !== -1) {
      urlsList = arg.split(',').map(url => url.trim());
    } else {
      urlsList = [arg];
    }
  }

  urlsList.forEach(url => openBrowser(url));
};
