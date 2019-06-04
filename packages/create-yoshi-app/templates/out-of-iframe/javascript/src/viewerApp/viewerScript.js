import { createAppController } from '../components/App/appController';

export const createControllers = ([appControllerConfig]) => {
  return [createAppController(appControllerConfig)];
};

const viewerScript = {
  createControllers,
};

export default viewerScript;
