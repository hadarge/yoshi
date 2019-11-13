import 'isomorphic-fetch';
import { EXPERIMENTS_SCOPE } from '../config/constants';
import { mockExperiments } from '../components/Widget/appController.spec';
import viewerScript from './viewerScript';

describe('createControllers', () => {
  let widgetConfig;
  beforeEach(() => {
    widgetConfig = {
      appParams: {
        baseUrls: {
          staticsBaseUrl: 'http://localhost:3200/',
        },
      },
      wixCodeApi: {
        window: {
          multilingual: {
            isEnabled: false,
          },
        },
        site: {
          language: 'en',
        },
      },
    };
  });

  it('should return controllers with pageReady method given widgets config', async () => {
    mockExperiments(EXPERIMENTS_SCOPE, { someExperiment: 'true' });

    const result = viewerScript.createControllers([widgetConfig]);
    expect(result).toHaveLength(1);
    expect((await result[0]).pageReady.call).toBeDefined();
  });
});
