import fs from 'fs';
import path from 'path';
import execa from 'execa';
import tempy from 'tempy';
import { bin } from '../package.json';

const createYoshiAppBin = path.resolve(__dirname, '..', bin);

test('it should throw if the repository name is not validated by npm', async () => {
  expect.assertions(1);

  try {
    const tempDir = tempy.directory();
    const workingDir = path.join(tempDir, 'CamelCase');
    fs.mkdirSync(workingDir);
    await execa('node', [createYoshiAppBin], {
      cwd: workingDir,
      env: {
        FORCE_COLOR: '0',
      },
    });
  } catch (error) {
    expect(error.stderr).toMatchSnapshot();
  }
});

test('it should throw if the name inserted as an argument is not validated by npm', async () => {
  expect.assertions(1);

  try {
    await execa('node', [createYoshiAppBin, 'CamelCase'], {
      env: {
        FORCE_COLOR: '0',
      },
    });
  } catch (error) {
    expect(error.stderr).toMatchSnapshot();
  }
});
