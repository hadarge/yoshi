const { request } = require('../../utils');

describe('static assets', () => {
  it('serves static assets', async () => {
    expect(await request('http://localhost:3200/assets/hello.txt')).toBe(
      'Hello from public folder!',
    );
  });
});
