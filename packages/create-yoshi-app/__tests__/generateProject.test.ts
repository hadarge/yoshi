import path from 'path';
import tempy from 'tempy';
import { generateProject } from '../src';
import TemplateModel from '../src/TemplateModel';
import getFilesInDir from '../src/getFilesInDir';

test('verify generation works as expected', () => {
  const tempDir = tempy.directory();
  const templateModel = new TemplateModel(
    `test-project`,
    {
      name: 'fake-template',
      path: path.join(__dirname, './__fixtures__/fake-template/'),
    },
    'rany',
    'rany@wix.com',
    'typescript',
  );

  generateProject(templateModel, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
