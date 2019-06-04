import { withStyles } from '@wix/native-components-infra';
import App from '../components/App';

export default {
  component: withStyles(App, {
    cssPath: ['viewerApp.stylable.bundle.css'],
  }),
};
