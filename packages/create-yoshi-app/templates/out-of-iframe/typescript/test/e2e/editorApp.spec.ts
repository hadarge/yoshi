describe('React application', () => {
  it('should display title', async () => {
    await page.goto('https://localhost:3100/editorApp');
    await page.waitForSelector('h2');

    expect(await page.$eval('h2', (e: any) => e.innerText)).toEqual('Hello World!');
  });
});

//todo check (window as any)
