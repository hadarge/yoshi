it('should support overrides for "global", from jest-yoshi.config', async () => {
  expect(global['foo']).toEqual('bar');
});
