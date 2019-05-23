import { createAppController } from '../components/app/appController';
import {
  IWidgetController,
  IWidgetControllerConfig,
} from '@wix/native-components-infra/dist/src/types/types';

function createControllers(
  controllersConfig: IWidgetControllerConfig[],
): Promise<IWidgetController>[] {
  return [createAppController(controllersConfig[0])];
}

export const viewerScript: { createControllers } = {
  createControllers,
};
