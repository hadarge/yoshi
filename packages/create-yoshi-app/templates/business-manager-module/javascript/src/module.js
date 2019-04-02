import React from 'react';
import {
  BusinessManagerModule,
  registerModule,
} from '@wix/business-manager-api';
import { ModuleRegistry } from 'react-module-container';
import { MODULE_ID, LAZY_COMPONENT_ID, COMPONENT_ID } from './config';

class BMLazyComponent extends React.Component {
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
    return this.state.component ? (
      <this.state.component {...this.props} />
    ) : (
      <h1>Loading...</h1>
    );
  }
}

class BMModule extends BusinessManagerModule {
  constructor(moduleId) {
    super(moduleId);
    ModuleRegistry.registerComponent(LAZY_COMPONENT_ID, () => BMLazyComponent);
  }
}

registerModule(MODULE_ID, BMModule);
