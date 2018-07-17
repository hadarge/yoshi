import {
  BusinessManagerModule,
  registerModule,
  ModuleId,
  TPrefetchParams,
  TModuleParams,
} from '@wix/business-manager-api';
import {
  ModuleRegistry,
  ReactLazyComponent,
  ReactLazyComponentOptions,
} from 'react-module-container';
import {
  MODULE_ID,
  LAZY_COMPONENT_ID,
  COMPONENT_ID,
  IBMModuleParams,
} from './config';

const files = props => {
  const minified = debug => (debug ? '' : '.min');
  const APP_BUNDLE_FILE = '{%projectName%}-app'; // should be in sync with app's entry-point name in package.json
  return [
    `${props.config.topology.staticsUrl}${APP_BUNDLE_FILE}.bundle${minified(
      props.debug,
    )}.js`,
    `${props.config.topology.staticsUrl}${APP_BUNDLE_FILE}${minified(
      props.debug,
    )}.css`,
  ];
};

class BMLazyComponent extends ReactLazyComponent<IBMModuleParams> {
  static prefetch(params: TPrefetchParams) {
    return files(params);
  }

  constructor(props: TModuleParams) {
    const options: ReactLazyComponentOptions = {
      files: files(props),
      component: COMPONENT_ID,
    };
    super(props, options);
  }
}

class BMModule extends BusinessManagerModule {
  constructor(moduleId: ModuleId) {
    super(moduleId);
    ModuleRegistry.registerComponent(LAZY_COMPONENT_ID, () => BMLazyComponent);
  }
}

registerModule(MODULE_ID, BMModule);
