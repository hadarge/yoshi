const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { generateProject } = require('../src');
const getFilesInDir = require('../src/getFilesInDir');

const projectTypes = fs.readdirSync(path.join(__dirname, '../templates'));

const mockedAnswers = projectTypes.map(projectType => [
  projectType,
  {
    projectName: `test-${projectType}`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    organization: 'wix',
    projectType: projectType.replace('-typescript', ''),
    transpiler: projectType.endsWith('typescript') ? 'typescript' : 'babel',
  },
]);

test.each(mockedAnswers)('%s', (testName, answers) => {
  const tempDir = tempy.directory();

  generateProject(answers, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
