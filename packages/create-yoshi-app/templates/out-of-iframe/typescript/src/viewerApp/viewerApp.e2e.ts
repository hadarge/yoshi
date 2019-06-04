describe('Viewer App', () => {
  it('should display the title text', async () => {
    await page.goto('https://gileck5.wixsite.com/ooi-dev');
    await page.waitForSelector('h2');

    expect(await page.$eval('h2', (e: any) => e.innerText)).toEqual(
      'Hello World!',
    );
  });
});
