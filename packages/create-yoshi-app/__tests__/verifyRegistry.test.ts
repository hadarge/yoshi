import tempy from 'tempy';
import verifyRegistry from '../src/verifyRegistry';
import { isPrivateRegistryReachable } from '../src/utils';

jest.mock('../src/utils', () => ({
  isPrivateRegistryReachable: jest.fn(),
}));

describe('verifyRegistry', () => {
  let tempDir: string, exitSpy: jest.SpyInstance, errorSpy: jest.SpyInstance;

  beforeEach(() => {
    tempDir = tempy.directory();
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test('should fail when user does not connect to VPN', () => {
    (isPrivateRegistryReachable as jest.Mock).mockReturnValue(false);

    verifyRegistry(tempDir);

    expect(exitSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  test('should not fail when user is using VPN', () => {
    (isPrivateRegistryReachable as jest.Mock).mockReturnValue(true);

    verifyRegistry(tempDir);

    expect(exitSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
