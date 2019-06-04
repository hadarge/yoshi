import React from 'react';
import ReactDOM from 'react-dom';
import { ViewerScriptWrapper, withStyles } from '@wix/native-components-infra';
import App from '../components/App';
import viewerScript from '../viewerApp/viewerScript';

const WrappedExampleWidget = ViewerScriptWrapper(
  withStyles(App, {
    cssPath: ['editorApp.stylable.bundle.css'],
  }),
  {
    viewerScript,
    Wix: window.Wix,
    widgetConfig: {
      widgetId: '',
    },
    overrides: {
      platform: {
        baseUrls: {
          staticsBaseUrl: window.__STATICS_BASE_URL__,
        },
      },
    },
  },
);

ReactDOM.render(<WrappedExampleWidget />, document.getElementById('root'));
