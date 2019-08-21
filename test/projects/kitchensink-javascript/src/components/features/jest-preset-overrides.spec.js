it('should support overrides for "global", from jest-yoshi.config', async () => {
  expect(global['foo']).toEqual('bar');
});

it('should support overrides for "testURL", from jest-yoshi.config', async () => {
  expect(window.location.href).toEqual('http://localhost:3000/?query=param');
});
