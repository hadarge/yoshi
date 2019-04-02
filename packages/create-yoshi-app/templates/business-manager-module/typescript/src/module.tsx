import * as React from 'react';
import {
  BusinessManagerModule,
  registerModule,
  ModuleId,
} from '@wix/business-manager-api';
import {
  ModuleRegistry,
} from 'react-module-container';
import {
  MODULE_ID,
  LAZY_COMPONENT_ID,
  COMPONENT_ID,
} from './config';

interface BMLazyComponentState {
  component: any
}

class BMLazyComponent extends React.Component<any, BMLazyComponentState> {
  state = {
    component: null,
  };

  componentDidMount() {
    ModuleRegistry.notifyListeners(
      'reactModuleContainer.componentStartLoading',
      COMPONENT_ID,
    );
    import('./client').then(
      () => {
        ModuleRegistry.notifyListeners(
          'reactModuleContainer.componentReady',
          COMPONENT_ID,
        );
        const component = ModuleRegistry.component(COMPONENT_ID);
        this.setState({ component });
      },
      error => {
        console.error(`Error loading component ${COMPONENT_ID}`, error);
      },
    );
  }

  render() {
    const Component = this.state.component;
    return Component ? <Component {...this.props} /> : <h1>Loading...</h1>;
  }
}

class BMModule extends BusinessManagerModule {
  constructor(moduleId: ModuleId) {
    super(moduleId);
    ModuleRegistry.registerComponent(LAZY_COMPONENT_ID, () => BMLazyComponent);
  }
}

registerModule(MODULE_ID, BMModule);
