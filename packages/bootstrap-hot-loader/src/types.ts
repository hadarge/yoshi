import { Router } from 'express';

export type BootstrapContext = { [name: string]: any };

export type BootstrapFunction = (
  app: Router,
  context: BootstrapContext,
) => Router | Promise<Router>;

export type BootstrapHotFunction = (
  sourceModule: NodeModule,
  wrappedFunction: BootstrapFunction,
) => BootstrapFunction;
