const tempy = require('tempy');
const path = require('path');
const fs = require('fs');
const verifyWorkingDirectory = require('../src/verifyWorkingDirectory');

function createDirectory(dirPath, dirName) {
  const newPath = path.join(dirPath, dirName);
  fs.mkdirSync(newPath);
  return newPath;
}

function createFile(dirPath, name, content) {
  fs.writeFileSync(path.join(dirPath, name), content);
}

describe('verifyWorkingDirectory', () => {
  let tempDir, exitSpy, logSpy;

  beforeEach(() => {
    tempDir = tempy.directory();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('should not fail for an empty directory', () => {
    verifyWorkingDirectory(tempDir);
    expect(exitSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('should not fail for a directory with ONLY .git directory (and anything inside it)', () => {
    const gitDirectoryPath = createDirectory(tempDir, '.git');
    createFile(gitDirectoryPath, 'bla.txt', 'Helloooo');
    verifyWorkingDirectory(tempDir);
    expect(exitSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('should exit with status code 1 for a non empty directory', () => {
    createFile(tempDir, 'bla.txt', 'Helloooo');
    verifyWorkingDirectory(tempDir);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(logSpy).toHaveBeenCalledWith(
      `The directory "${tempDir}" is not an empty directory\n`,
    );
    expect(logSpy).toHaveBeenCalledWith('Aborting...');
  });
});
