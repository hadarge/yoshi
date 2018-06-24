const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');
const expect = require('expect');

const taskPath = require.resolve('../index.js');

const fromFixture = filename => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

describe('haste-task-ng-annotate', () => {
  let test;

  afterEach(() => test.cleanup());

  it('works', async () => {
    const input = fromFixture('./fixtures/file.js');
    const expectedOutput = fromFixture('./fixtures/file-annotated.js');

    test = await setup({
      'src/file.js': input,
    });

    await test.run(async ({ [taskPath]: ngAnnotate }) => {
      await ngAnnotate({
        pattern: '**/*.js',
        target: './',
      });
    });

    expect(test.files['src/file.js'].content).toEqual(expectedOutput);
  });
});
