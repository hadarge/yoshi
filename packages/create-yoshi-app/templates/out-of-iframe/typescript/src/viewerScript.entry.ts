import { viewerScript } from './platform/viewerScript';
import { ICreateControllers } from '@wix/native-components-infra/dist/src/types/types';

export const {
  createControllers,
}: { createControllers: ICreateControllers } = viewerScript;

// This file must export a named export of "createControllers"
