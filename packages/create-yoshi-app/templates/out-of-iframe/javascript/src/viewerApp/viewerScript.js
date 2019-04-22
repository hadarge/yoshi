import { createAppController } from '../components/app/appController';

export const createControllers = ([appControllerConfig]) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript = {
  createControllers,
};

export default viewerScript;
