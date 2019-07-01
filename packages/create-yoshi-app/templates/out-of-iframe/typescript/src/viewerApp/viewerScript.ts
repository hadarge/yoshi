import {
  IWidgetControllerConfig,
  IViewerScript,
} from '@wix/native-components-infra/dist/src/types/types';
import { createAppController } from '../components/Widget/appController';

export const createControllers = ([appControllerConfig]: Array<
  IWidgetControllerConfig
>) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript: IViewerScript = {
  createControllers,
};

export default viewerScript;
