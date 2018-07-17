const fs = require('fs');
const path = require('path');
const getGitConfig = require('git-config');

module.exports = async workingDir => {
  const projectTypes = fs
    .readdirSync(path.join(__dirname, '../templates'))
    .filter(type => !type.endsWith('-typescript'));
  const gitConfig = getGitConfig.sync();

  return [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name',
      initial: path.basename(workingDir),
    },
    {
      type: 'text',
      name: 'authorName',
      message: 'Author name',
      initial: gitConfig.user.name,
    },
    {
      type: 'text',
      name: 'authorEmail',
      message: 'Author email@wix',
      initial: gitConfig.user.email,
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
