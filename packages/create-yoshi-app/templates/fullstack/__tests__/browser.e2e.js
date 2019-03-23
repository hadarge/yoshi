describe('React application', () => {
  it('should display title', async () => {
    await page.goto(app.getUrl('/'));
    await page.waitForSelector('h2');

    expect(await page.$eval('h2', e => e.innerText)).toEqual('Hello World!');
  });
});
