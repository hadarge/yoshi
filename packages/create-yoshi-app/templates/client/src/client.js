import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { I18nextProvider } from 'react-i18next';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import App from './components/App';
import i18n from './i18n';
import { create as createFedopsLogger } from '@wix/fedops-logger';

const locale = window.__LOCALE__;
const baseURL = window.__BASEURL__;

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
