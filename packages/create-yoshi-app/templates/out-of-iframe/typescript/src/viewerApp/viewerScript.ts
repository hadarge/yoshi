import { createAppController } from '../components/app/appController';

import { ICreateControllers } from '@wix/native-components-infra/dist/src/types/types';
// TODO assign this type

export const createControllers = ([appControllerConfig]) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript = {
  createControllers,
};

export default viewerScript;
