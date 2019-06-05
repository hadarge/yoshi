const getGitConfig = require('parse-git-config');
const templates = require('../templates');

module.exports = () => {
  const gitConfig = getGitConfig.sync({ include: true, type: 'global' });

  const gitUser = gitConfig.user || {};
  const gitName = gitUser.name || '';
  const gitEmail = gitUser.email || '';

  return [
    {
      type: 'text',
      name: 'authorName',
      message: 'Author name',
      initial: gitName,
    },
    {
      type: 'text',
      name: 'authorEmail',
      message: 'Author @wix.com email',
      initial: gitEmail.endsWith('@wix.com') ? gitEmail : '',
      validate: value =>
        value.endsWith('@wix.com') ? true : 'Please enter a @wix.com email',
    },
    {
      type: 'select',
      name: 'templateDefinition',
      message: 'Choose project type',
      choices: templates.map(project => ({
        title: project.name,
        value: project,
      })),
    },
    {
      type: 'select',
      name: 'transpiler',
      message: 'Choose JavaScript Transpiler',
      choices: [
        { title: 'Typescript', value: 'typescript' },
        { title: 'Babel', value: 'babel' },
      ],
    },
  ];
};
