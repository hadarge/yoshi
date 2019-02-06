const verifyMinimumNodeVersion = require('../verifyMinimumNodeVersion');

function setNodeVersion(version) {
  Object.defineProperty(process, 'version', {
    value: version,
  });
}

describe('verifyMinimumNodeVersion', () => {
  let version, exitSpy, logSpy;

  beforeEach(() => {
    version = process.version;
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    setNodeVersion(version);
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('should verify the node version successfully', () => {
    setNodeVersion('v9.0.0');
    verifyMinimumNodeVersion('8.0.0');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('should fail on major version', () => {
    setNodeVersion('v7.0.0');
    verifyMinimumNodeVersion('8.0.0');
    expect(exitSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      `Node version v7.0.0 is less than the required version of v8.0.0\n`,
    );
  });

  test('should fail on minor version', () => {
    setNodeVersion('v7.2.0');
    verifyMinimumNodeVersion('7.3.0');
    expect(exitSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      `Node version v7.2.0 is less than the required version of v7.3.0\n`,
    );
  });

  test('should fail on patch version', () => {
    setNodeVersion('v7.2.1');
    verifyMinimumNodeVersion('7.2.2');
    expect(exitSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      `Node version v7.2.1 is less than the required version of v7.2.2\n`,
    );
  });
});
