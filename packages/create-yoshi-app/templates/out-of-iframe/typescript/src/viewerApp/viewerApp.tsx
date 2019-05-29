import App from '../components/app/App';
import { withStyles } from '@wix/native-components-infra';

export default {
  component: withStyles(App, {
    cssPath: ['viewerApp.stylable.bundle.css'],
  }),
};
