const { join } = require('path');

module.exports = [
  { name: 'fullstack', path: join(__dirname, '../templates/fullstack') },
  { name: 'client', path: join(__dirname, '../templates/client') },
  {
    name: 'business-manager-module',
    path: join(__dirname, '../templates/business-manager-module'),
  },
  { name: 'server', path: join(__dirname, '../templates/server') },
];
