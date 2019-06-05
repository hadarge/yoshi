const path = require('path');
const tempy = require('tempy');
const { generateProject } = require('../src');
const TemplateModel = require('../src/TemplateModel');
const getFilesInDir = require('../src/getFilesInDir');

test('verify generation works as expected', () => {
  const tempDir = tempy.directory();
  const templateModel = new TemplateModel({
    projectName: `test-project`,
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    transpiler: 'typescript',
    templateDefinition: {
      name: 'fake-template',
      path: path.join(__dirname, './__fixtures__/fake-template/'),
    },
  });

  generateProject(templateModel, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
