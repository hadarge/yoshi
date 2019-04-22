import App from '../components/app/App';
import { withStyles } from '@wix/native-components-infra';

export default {
  component: withStyles(App, {
    cssPath: ['editorApp.stylable.bundle.css'],
  }),
};

// This file must export a default export object with "component" key
