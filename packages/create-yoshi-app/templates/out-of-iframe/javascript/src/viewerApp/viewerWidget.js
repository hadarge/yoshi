import { withStyles } from '@wix/native-components-infra';
import Widget from '../components/Widget';

export default {
  component: withStyles(Widget, {
    cssPath: ['viewerWidget.stylable.bundle.css'],
  }),
};
