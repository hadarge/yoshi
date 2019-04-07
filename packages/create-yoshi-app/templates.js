const { join } = require('path');

const toTemplatePath = templateName =>
  join(__dirname, 'templates', templateName);

module.exports = [
  { name: 'fullstack', path: toTemplatePath('fullstack') },
  { name: 'client', path: toTemplatePath('client') },
  {
    name: 'business-manager-module',
    path: toTemplatePath('business-manager-module'),
  },
  { name: 'server', path: toTemplatePath('server') },
  { name: 'library', path: toTemplatePath('library') },
  {
    name: 'out-of-iframe',
    path: toTemplatePath('out-of-iframe'),
  },
];
