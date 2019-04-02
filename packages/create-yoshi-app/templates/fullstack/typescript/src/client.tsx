import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as axios from 'axios';
import { I18nextProvider } from 'react-i18next';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import i18n from './i18n';
import App from './components/App';
import { create as createFedopsLogger } from '@wix/fedops-logger';

const baseURL = window.__BASEURL__;
const locale = window.__LOCALE__;

wixAxiosConfig(axios, { baseURL });

const fedopsLogger = createFedopsLogger('{%projectName%}');

// Move the following `appLoaded()` call to the point where your app has fully loaded.
// See https://github.com/wix-private/fed-infra/blob/master/fedops/fedops-logger/README.md
fedopsLogger.appLoaded();

ReactDOM.render(
  <I18nextProvider i18n={i18n(locale)}>
    <App />
  </I18nextProvider>,
  document.getElementById('root'),
);
