import { createAppController } from '../components/App/appController';

import {
  IWidgetControllerConfig,
  IViewerScript,
} from '@wix/native-components-infra/dist/src/types/types';

export const createControllers = ([
  appControllerConfig,
]: IWidgetControllerConfig[]) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript: IViewerScript = {
  createControllers,
};

export default viewerScript;
