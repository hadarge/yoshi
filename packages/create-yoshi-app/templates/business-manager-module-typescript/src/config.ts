import { TModuleParams } from '@wix/business-manager-api';
/**
 NOTE: after submitting PR to BM you have to replace MODULE_ID and LAZY_COMPONENT_ID
  with real ENUM values from business-manager-api package (the ones that were used in .json.erb)
 Example:
  export const MODULE_ID = ModuleId.HelloWorld;
  export const LAZY_COMPONENT_ID = PageComponentId.HelloWorld;
 **/
// Note: should be in sync with the config inside your BM module ERB
export const MODULE_ID: any = '{%PROJECT_NAME%}';
export const LAZY_COMPONENT_ID: any = '{%projectName%}-lazy-component-id';

export const COMPONENT_ID: any = '{%projectName%}-component-id';
export const BI_VIEW_ID = '{%projectName%}_APP_VIEW_ID';

export interface IERBConfig {
  topology: {
    staticsUrl: string;
  };
}

export interface IBMModuleParams extends TModuleParams {
  config: IERBConfig;
}
