declare module 'react-module-container' {
  import * as React from 'react';
  import { PageComponentId } from '@wix/business-manager-api';

  export interface ReactLazyComponentOptions {
    files: Array<string>;
    component: string;
    unloadStylesOnDestroy?: boolean;
    resolve?(): Promise<any>;
  }
  export class ReactLazyComponent<P, S = {}> extends React.Component<P, S> {}
  export const ReactLoadableComponent: (
    name: string,
    resolve: () => Promise<{ default: React.ComponentType }>,
  ) => typeof ReactLazyComponent;
  export const ModuleRegistry: {
    registerComponent(
      pageComponentId: PageComponentId,
      componentFactory: () => any,
    ): void;
    invoke(eventName: string, payload: any): void;
    component(name: string): typeof React.Component;
    addListener(
      eventName: string,
      callback: (payload: any) => void,
    ): { remove(): void };
    notifyListeners(eventName: string, viewID: string): void;
  };
}
