const { Engine } = require('velocity');

const velocityData = require('../velocity.data.json');
const velocityDataPrivate = require('../velocity.private.data.json');

module.exports = (url, data = {}) =>
  new Engine({ template: url }).render({
    ...velocityData,
    ...velocityDataPrivate,
    ...data,
  });
