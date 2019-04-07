import { EXPERIMENTS_SCOPE } from '../config/index';
import Experiments from '@wix/wix-experiments';

function getLocale({ wixCodeApi }) {
  return wixCodeApi.window.locale || 'en';
}

async function getExperimentsByScope(scope) {
  const experiments = new Experiments({
    scope,
  });
  await experiments.ready();
  return experiments.all();
}

export async function exampleWidgetControllerFactory(controllerConfig) {
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
