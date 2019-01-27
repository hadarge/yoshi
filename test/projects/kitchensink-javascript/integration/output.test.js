const fs = require('fs-extra');
const path = require('path');

jest.setTimeout(60 * 1000);

const originalFilePath = path.join(
  global.scripts.testDirectory,
  'src/client.js',
);

const originalServerFilePath = path.join(
  global.scripts.testDirectory,
  'src/server.js',
);

const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

const originalServerContent = fs.readFileSync(originalServerFilePath, 'utf-8');

async function replaceOriginalEntry(relativeFilePath) {
  const newFilePath = path.join(global.scripts.testDirectory, relativeFilePath);
  const newContent = fs.readFileSync(newFilePath, 'utf-8');

  await fs.writeFile(originalFilePath, newContent);
}

describe('output', () => {
  afterEach(() => {
    // reset state back to normal after every test
    fs.writeFileSync(originalFilePath, originalContent);
    fs.writeFileSync(originalServerFilePath, originalServerContent);
  });

  it('runs successfully', async () => {
    const result = await global.scripts.build();

    expect(result.stdout).toMatch('Compiled successfully.');
  });

  it('fails with babel syntax errors', async () => {
    expect.assertions(1);

    await replaceOriginalEntry('src/errors/clientBabel.js');

    try {
      await global.scripts.build();
    } catch (error) {
      expect(error.stderr).toMatch('Unexpected token (1:9)');
    }
  });

  it('fails with css syntax errors', async () => {
    expect.assertions(1);

    await replaceOriginalEntry('src/errors/clientCss.js');

    try {
      await global.scripts.build();
    } catch (error) {
      expect(error.stderr).toMatch('(1:1) Unclosed block');
    }
  });

  it('fails with case sensitive imports', async () => {
    expect.assertions(1);

    await replaceOriginalEntry('src/errors/clientCaseSensitive.js');

    try {
      await global.scripts.build();
    } catch (error) {
      if (process.platform === 'darwin') {
        expect(error.stderr).toMatch(
          "Cannot find file: 'clientcasesensitive.js' does not match the " +
            "corresponding name on disk: './src/errors/clientCaseSensitive.js'.",
        );
      } else {
        expect(error.stderr).toMatch(
          "Module not found: Can't resolve './errors/clientcasesensitive'",
        );
      }
    }
  });

  it("fails when client entry doesn't exist", async () => {
    expect.assertions(1);

    await fs.remove(originalFilePath);

    try {
      await global.scripts.build();
    } catch (error) {
      expect(error.stderr).toMatch(
        "(client) Entry module not found: Error: Can't resolve './client'",
      );
    }
  });

  it("fails when server entry doesn't exist", async () => {
    expect.assertions(1);

    await fs.remove(originalServerFilePath);

    try {
      await global.scripts.build();
    } catch (error) {
      expect(error.stderr).toMatch(
        "(server) Entry module not found: Error: Can't resolve './server'",
      );
    }
  });
});
