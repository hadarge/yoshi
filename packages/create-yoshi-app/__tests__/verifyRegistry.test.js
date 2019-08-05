const tempy = require('tempy');
const verifyRegistry = require('../src/verifyRegistry');
const { isPrivateRegistryReachable } = require('../src/utils');

jest.mock('../src/utils', () => ({
  isPrivateRegistryReachable: jest.fn(),
}));

describe('verifyRegistry', () => {
  let tempDir, exitSpy, errorSpy;

  beforeEach(() => {
    tempDir = tempy.directory();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test('should fail when user does not connect to VPN', () => {
    isPrivateRegistryReachable.mockReturnValue(false);

    verifyRegistry(tempDir);

    expect(exitSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  test('should not fail when user is using VPN', () => {
    isPrivateRegistryReachable.mockReturnValue(true);

    verifyRegistry(tempDir);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
