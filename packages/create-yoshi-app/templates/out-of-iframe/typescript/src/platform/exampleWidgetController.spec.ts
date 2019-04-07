import { exampleWidgetControllerFactory } from './exampleWidgetController';
import LaboratoryTestkit from '@wix/wix-experiments/dist/src/laboratory-testkit';
import { EXPERIMENTS_SCOPE } from '../config';
import { ExperimentsBag } from '@wix/wix-experiments';

export function mockExperiments(
  scope: string,
  experiments: ExperimentsBag,
): void {
  new LaboratoryTestkit()
    .withScope(scope)
    .withBaseUrl(window.location.href)
    .withExperiments(experiments)
    .start();
}

describe('exampleWidgetControllerFactory', () => {
  it('should call setProps with data', async () => {
    mockExperiments(EXPERIMENTS_SCOPE, { someExperiment: 'true' });
    const setPropsSpy = jest.fn();
    const appParams: any = {
      baseUrls: {
        staticsBaseUrl: 'http://some-static-url.com',
      },
    };
    const locale = 'locale';
    const experiments = { someExperiment: 'true' };

    const controller = await exampleWidgetControllerFactory({
      appParams,
      setProps: setPropsSpy,
      wixCodeApi: {
        window: {
          locale,
        },
      },
    } as any);

    controller.pageReady();

    expect(setPropsSpy).toBeCalledWith({
      name: 'World',
      cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
      locale,
      experiments,
    });
  });
});
