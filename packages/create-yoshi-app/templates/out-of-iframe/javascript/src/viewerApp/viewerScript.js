import { createAppController } from '../components/Widget/appController';

export const createControllers = ([appControllerConfig]) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript = {
  createControllers,
};

export default viewerScript;
