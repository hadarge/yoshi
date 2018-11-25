const { request, waitForPort } = require('../../utils');

jest.setTimeout(30 * 1000);

describe('analyze', () => {
  it('opens bundle analyze', async () => {
    const build = global.scripts.analyze();

    try {
      await waitForPort(8888, { timeout: 20000 });
      expect(await request('http://localhost:8888')).toMatch(
        '<title>Webpack Bundle Analyzer</title>',
      );
    } finally {
      await build.done();
    }
  });
});
