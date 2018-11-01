const execa = require('execa');
const tempy = require('tempy');
const fs = require('fs');
const path = require('path');

test('it should throw if the repository name is not validated by npm', async () => {
  expect.assertions(1);

  try {
    const tempDir = tempy.directory();
    const workingDir = path.join(tempDir, 'CamelCase');
    fs.mkdirSync(workingDir);
    await execa(
      'node',
      [path.join(process.cwd(), '../create-yoshi-app/bin/create-yoshi-app.js')],
      { cwd: workingDir },
    );
  } catch (error) {
    expect(error.stderr).toMatchSnapshot();
  }
});

test('it should throw if the name inserted as an argument is not validated by npm', async () => {
  expect.assertions(1);

  try {
    await execa('node', [
      '../create-yoshi-app/bin/create-yoshi-app.js',
      'CamelCase',
    ]);
  } catch (error) {
    expect(error.stderr).toMatchSnapshot();
  }
});
