const path = require('path');
const fs = require('fs-extra');
const { ciEnv, localEnv } = require('../../../../scripts/utils/constants');

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
  beforeAll(() => replaceOriginalEntry('src/cases/manifest.tsx'));
  afterAll(() => {
    // reset state back to normal after every test
    fs.writeFileSync(originalFilePath, originalContent);
  });

  describe('build', () => {
    beforeAll(() => global.scripts.build(ciEnv));
    it('generates manifest stat file for non optimized', async () => {
      const statsFilePath = path.join(
        process.env.TEST_DIRECTORY,
        'dist/statics/1.0.0/manifest.debug.json',
      );

      const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

      expect(json).toMatchSnapshot();
    });

    it('generates manifest stat file for optimized', async () => {
      const statsFilePath = path.join(
        process.env.TEST_DIRECTORY,
        'dist/statics/1.0.0/manifest.prod.json',
      );

      const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

      expect(json).toMatchSnapshot();
    });
  });

  describe('start', () => {
    let startResult;
    afterEach(async () => {
      if (startResult) {
        await startResult.done();
      }
    });

    it('generates manifest stat file', async () => {
      startResult = await global.scripts.start(localEnv);

      const statsFilePath = path.join(
        process.env.TEST_DIRECTORY,
        'dist/statics/manifest.dev.json',
      );

      const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

      expect(json).toMatchSnapshot();
    });
  });
});
