import { exampleWidgetControllerFactory } from './exampleWidgetController';
import {
  IWidgetController,
  IWidgetControllerConfig,
} from '@wix/native-components-infra/dist/src/types/types';

function createControllers(
  controllersConfig: IWidgetControllerConfig[],
): Promise<IWidgetController>[] {
  return [exampleWidgetControllerFactory(controllersConfig[0])];
}

export const viewerScript: { createControllers } = {
  createControllers,
};
