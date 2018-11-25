describe('dev-server', () => {
  it('shows the contents of static assets', async () => {
    await page.goto('http://localhost:3200');

    const list = await page.$$eval('#files li a', lis => {
      return lis.map(li => li.textContent);
    });

    expect(list).toEqual(
      expect.arrayContaining(['components/', 'app.bundle.js', 'assets/']),
    );
  });
});
