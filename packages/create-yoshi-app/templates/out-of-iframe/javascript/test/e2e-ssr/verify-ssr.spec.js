import { withSsr } from '@wix/santa-site-renderer-testkit';

jest.setTimeout(100000);

// We should verify our viewerScript doesn't break user's site SSR
// In order to do that, we need to run the viewer (santa) with our app.
// However, we don't want it to point to the production version (what we defined in dev center)
// we want it to point to our local dev env - https://localhost:3200/viewerScript.bundle.min.js
// We override that with the `specs.infra.OOILocalDev` experiment, more info here:
// https://github.com/wix-private/meta-site/blob/master/wix-meta-site-server/app-store-service/client-spec-map-experiment-server/README.md

describe('out-of-iframe santa ssr', () => {
  test(
    'should not diverge',
    withSsr(
      {
        baseUrl:
          'https://ssrdev.wixsite.com/yoshi-out-of-iframe?petri_ovr=specs.infra.OOILocalDev:true',
        experimentsOn: [],
      },
      async ({ ssr }) => {
        console.log('Trying to check clientSide...');
        const ssrSuccess = await ssr.renderClientSide();
        expect(ssrSuccess).toBe(true);
      },
    ),
  );
});
