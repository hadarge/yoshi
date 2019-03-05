const path = require('path');
const fs = require('fs-extra');

jest.setTimeout(60 * 1000);

describe('stats', () => {
  it('generates webpack stats file', async () => {
    await global.scripts.build({}, ['--stats']);

    const statsFilePath = path.join(
      process.env.TEST_DIRECTORY,
      'target/webpack-stats.json',
    );

    expect(fs.existsSync(statsFilePath)).toBeTruthy();
  });
});
