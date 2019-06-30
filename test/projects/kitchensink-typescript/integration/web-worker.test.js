const { initTest } = require('../../../utils');

describe('web-worker', () => {
  let log;
  let info;

  beforeAll(async () => {
    log = new Promise(resolve => {
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          resolve(msg.text());
        }
      });
    });

    info = new Promise(resolve => {
      page.on('console', msg => {
        if (msg.type() === 'error') {
          resolve(msg.text());
        }
      });
    });

    await initTest('web-worker');
  });

  it('creates a web worker bundle on the page', async () => {
    expect(await log).toBe('hello from a web worker');
  });

  it('supports externals for web-worker', async () => {
    expect(await info).toBe('Some external text');
  });
});
