import { withStyles } from '@wix/native-components-infra';
import Widget from '../components/Widget';

export default {
  component: withStyles(Widget, {
    cssPath: ['viewerApp.stylable.bundle.css'],
  }),
};
