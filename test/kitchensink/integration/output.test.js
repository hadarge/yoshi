jest.setTimeout(20 * 1000);

describe('output', () => {
  it('runs successfully', async () => {
    const result = await global.scripts.build();

    expect(result.code).toEqual(0);
    expect(result.stdout).toMatch('Compiled successfully.');
  });
});
