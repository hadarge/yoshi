const path = require('path');
const tempy = require('tempy');
const { generateProject } = require('../src');
const Answers = require('../src/Answers');
const getFilesInDir = require('../src/getFilesInDir');

test('verify generation works as expected', () => {
  const tempDir = tempy.directory();
  const answers = new Answers({
    projectName: `test-project`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    organization: 'wix',
  });

  // override the templatePath to our fake template directory
  Object.defineProperty(answers, 'templatePath', {
    get: function() {
      return path.join(__dirname, './__fixtures__/fake-template/');
    },
  });

  generateProject(answers, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
