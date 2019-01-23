const { initTest } = require('../../../utils');

describe('optimize', () => {
  describe('tree shaking', () => {
    it('removes unused exports', async () => {
      const logs = [];

      page.on('console', msg => {
        if (msg.type() === 'info') {
          logs.push(msg.text());
        }
      });

      await initTest('tree-shaking-unused-export');

      expect(logs).toEqual(['module-with-multiple-exports']);
    });
  });
});
