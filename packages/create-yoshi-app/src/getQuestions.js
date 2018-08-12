const fs = require('fs');
const path = require('path');
const getGitConfig = require('parse-git-config');

module.exports = async () => {
  const projectTypes = fs
    .readdirSync(path.join(__dirname, '../templates'))
    .filter(type => !type.endsWith('-typescript'));
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
    },
    {
      type: 'text',
      name: 'organization',
      message: 'Organization (for pom.xml)',
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'Choose project type',
      choices: projectTypes.map(projectType => ({
        title: projectType,
        value: projectType,
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
