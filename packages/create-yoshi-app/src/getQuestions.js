const getGitConfig = require('parse-git-config');
const projects = require('./projects');

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
      type: 'text',
      name: 'organization',
      message: 'Organization (for pom.xml)',
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'Choose project type',
      choices: projects
        .filter(type => !type.endsWith('-typescript'))
        .map(projectType => ({
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
