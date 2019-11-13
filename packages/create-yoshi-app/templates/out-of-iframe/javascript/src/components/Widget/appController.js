import { EXPERIMENTS_SCOPE } from '../../config/constants';
import Experiments from '@wix/wix-experiments';

function getSiteLanguage({ wixCodeApi }) {
  if (wixCodeApi.window.multilingual.isEnabled) {
    return wixCodeApi.window.multilingual.currentLanguage;
  }

  // NOTE: language can be null (see WEED-18001)
  return wixCodeApi.site.language || 'en';
}

function isMobile({ wixCodeApi }) {
  return wixCodeApi.window.formFactor === 'Mobile';
}

async function getExperimentsByScope(scope) {
  const experiments = new Experiments({
    scope,
  });
  await experiments.ready();
  return experiments.all();
}

export async function createAppController(controllerConfig) {
  const { appParams, setProps } = controllerConfig;
  const language = getSiteLanguage(controllerConfig);
  const mobile = isMobile(controllerConfig);
  const experiments = await getExperimentsByScope(EXPERIMENTS_SCOPE);

  return {
    async pageReady() {
      setProps({
        name: 'World',
        cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
        language,
        mobile,
        experiments,
      });
    },
  };
}
