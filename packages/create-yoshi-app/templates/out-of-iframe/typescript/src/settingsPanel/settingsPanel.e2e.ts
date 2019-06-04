describe('Settings Panel', () => {
  it('should display 3 sections', async () => {
    await page.goto('https://localhost:3100/settingsPanel');

    expect(await page.$$eval('section', sections => sections.length)).toBe(3);
  });
});
