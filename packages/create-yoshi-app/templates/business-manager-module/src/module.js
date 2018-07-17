import {
  BusinessManagerModule,
  registerModule,
} from '@wix/business-manager-api';
import { ModuleRegistry, ReactLazyComponent } from 'react-module-container';
import { MODULE_ID, LAZY_COMPONENT_ID, COMPONENT_ID } from './config';

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

class BMLazyComponent extends ReactLazyComponent {
  static prefetch(params) {
    return files(params);
  }

  constructor(props) {
    const options = {
      files: files(props),
      component: COMPONENT_ID,
    };
    super(props, options);
  }
}

class BMModule extends BusinessManagerModule {
  constructor(moduleId) {
    super(moduleId);
    ModuleRegistry.registerComponent(LAZY_COMPONENT_ID, () => BMLazyComponent);
  }
}

registerModule(MODULE_ID, BMModule);
