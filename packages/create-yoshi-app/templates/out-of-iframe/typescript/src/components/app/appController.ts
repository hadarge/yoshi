import { EXPERIMENTS_SCOPE } from '../../config/constants';
import Experiments from '@wix/wix-experiments';

import {
  IWidgetControllerConfig,
  IWidgetController,
} from '@wix/native-components-infra/dist/src/types/types';

function getLocale({ wixCodeApi }): string {
  return wixCodeApi.window.locale || 'en';
}

async function getExperimentsByScope(scope: string) {
  const experiments = new Experiments({
    scope,
  });
  await experiments.ready();
  return experiments.all();
}

export async function createAppController(
  controllerConfig: IWidgetControllerConfig,
): Promise<IWidgetController> {
  const { appParams, setProps } = controllerConfig;
  const locale = getLocale(controllerConfig);
  const experiments = await getExperimentsByScope(EXPERIMENTS_SCOPE);

  return {
    pageReady() {
      setProps({
        name: 'World',
        cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
        locale,
        experiments,
      });
    },
  };
}
