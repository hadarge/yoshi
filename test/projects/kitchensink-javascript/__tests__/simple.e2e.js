it('should pass', async () => {
  await page.goto('http://localhost:3100/css-inclusion');
  const result = await page.$eval('#css-inclusion', elm => elm.textContent);

  expect(result).toEqual('CSS Modules are working!');
});

it('should support overrides for "global", from jest-yoshi.config', async () => {
  expect(global['foo']).toEqual('bar');
});
