import { BootstrapHotFunction } from './types';

export const hot: BootstrapHotFunction = (sourceModule, wrappedFunction) =>
  wrappedFunction;
