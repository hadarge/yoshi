const path = require('path');
const fs = require('fs-extra');
const { ciEnv } = require('../../../../scripts/utils/constants');

jest.setTimeout(60 * 1000);

const originalFilePath = path.join(
  global.scripts.testDirectory,
  'src/client.tsx',
);

const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

async function replaceOriginalEntry(relativeFilePath) {
  const newFilePath = path.join(global.scripts.testDirectory, relativeFilePath);
  const newContent = fs.readFileSync(newFilePath, 'utf-8');

  await fs.writeFile(originalFilePath, newContent);
}

describe('manifest', () => {
  afterEach(() => {
    // reset state back to normal after every test
    fs.writeFileSync(originalFilePath, originalContent);
  });

  it('generates manifest stat file', async () => {
    await replaceOriginalEntry('src/cases/manifest.tsx');

    await global.scripts.build(ciEnv);

    const statsFilePath = path.join(
      process.env.TEST_DIRECTORY,
      'dist/statics/manifest.1.0.0.json',
    );

    const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

    expect(json).toMatchSnapshot();
  });
});
