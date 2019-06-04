import 'isomorphic-fetch';
import viewerScript from './viewerScript';
import { EXPERIMENTS_SCOPE } from '../config/constants';
import { mockExperiments } from '../components/App/appController.spec';

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
          locale: 'en',
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
