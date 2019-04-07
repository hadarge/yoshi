import { ExampleWidgetRoot } from './components/ExampleWidgetRoot/ExampleWidgetRoot';
import { withStyles } from '@wix/native-components-infra';

export default {
  component: withStyles(ExampleWidgetRoot, {
    cssPath: ['editorExampleWidget.stylable.bundle.css'],
  }),
};

// This file must export a default export object with "component" key
