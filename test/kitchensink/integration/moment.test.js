const { matchJS, initTest } = require('../../utils');

describe('moment', () => {
  it('exclude locales imported from moment', async () => {
    await initTest('exclude-moment');

    // should not include the `en` locale
    await matchJS('exclude-moment', page, [/^((?!hello).)*$/]);
  });

  it('include locales imported outside of moment', async () => {
    await initTest('exclude-moment');

    // should include the `de` locale
    await matchJS('exclude-moment', page, [/hallo/]);
  });
});
