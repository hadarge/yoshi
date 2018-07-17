import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import * as axios from 'axios';
import { wixAxiosConfig } from 'wix-axios-config';
import i18n from './i18n';
import App from './components/App';

const baseURL = window.__BASEURL__;
const locale: string = window.__LOCALE__;
const staticsBaseUrl: string = window.__STATICS_BASE_URL__;

wixAxiosConfig(axios, { baseURL });

ReactDOM.render(
  <I18nextProvider i18n={i18n({ locale, baseUrl: staticsBaseUrl })}>
    <App />
  </I18nextProvider>,
  document.getElementById('root'),
);
