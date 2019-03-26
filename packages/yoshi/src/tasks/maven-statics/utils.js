const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports.renderTemplate = (filename, data) => {
  const template = fs.readFileSync(filename).toString();

  return Object.keys(data).reduce(
    (acc, key) => acc.replace(`{{${key}}}`, data[key]),
    template,
  );
};

module.exports.readFile = filename =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

module.exports.writeFile = (filename, content) => {
  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(path.resolve(filename), content);
};
