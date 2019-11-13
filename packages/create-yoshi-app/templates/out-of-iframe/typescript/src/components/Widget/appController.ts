import Experiments from '@wix/wix-experiments';

import {
  IWidgetControllerConfig,
  IWidgetController,
} from '@wix/native-components-infra/dist/src/types/types';
import { EXPERIMENTS_SCOPE } from '../../config/constants';

function getSiteLanguage({ wixCodeApi }: IWidgetControllerConfig): string {
  if (wixCodeApi.window.multilingual.isEnabled) {
    return wixCodeApi.window.multilingual.currentLanguage;
  }

  // NOTE: language can be null (see WEED-18001)
  return wixCodeApi.site.language || 'en';
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
  const language = getSiteLanguage(controllerConfig);
  const experiments = await getExperimentsByScope(EXPERIMENTS_SCOPE);

  return {
    pageReady() {
      setProps({
        name: 'World',
        cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
        language,
        experiments,
      });
    },
  };
}
