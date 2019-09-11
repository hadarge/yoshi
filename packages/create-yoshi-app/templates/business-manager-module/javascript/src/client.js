import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { notifyViewStartLoading } from '@wix/business-manager-api';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import { COMPONENT_NAME } from './config';
import i18n from './i18n';
import App from './components/App';

wixAxiosConfig(axios, {
  baseURL: '/',
});

export default class AppContainer extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
    config: PropTypes.object,
  };

  constructor(props) {
    super(props);
    notifyViewStartLoading(COMPONENT_NAME);
  }

  render() {
    const { locale, config } = this.props;
    const baseUrl = config.topology.staticsUrl;
    return (
      <I18nextProvider i18n={i18n({ locale, baseUrl })}>
        <App />
      </I18nextProvider>
    );
  }
}
