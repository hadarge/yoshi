const tempy = require('tempy');
const getProjectTypes = require('../src/getProjectTypes');
const { generateProject } = require('../src');
const getFilesInDir = require('../src/getFilesInDir');
const Answers = require('../src/Answers');

const projectTypes = getProjectTypes();

const mockedAnswers = projectTypes.map(projectType => [
  projectType,
  new Answers({
    projectName: `test-${projectType}`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    organization: 'wix',
    projectType: projectType.replace('-typescript', ''),
    transpiler: projectType.endsWith('typescript') ? 'typescript' : 'babel',
  }),
]);

test.each(mockedAnswers)('%s', (testName, answers) => {
  const tempDir = tempy.directory();

  generateProject(answers, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
