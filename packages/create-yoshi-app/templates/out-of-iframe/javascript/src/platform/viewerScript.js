import { exampleWidgetControllerFactory } from './exampleWidgetController';

function createControllers(controllersConfig) {
  return [exampleWidgetControllerFactory(controllersConfig[0])];
}

export const viewerScript = {
  createControllers,
};
