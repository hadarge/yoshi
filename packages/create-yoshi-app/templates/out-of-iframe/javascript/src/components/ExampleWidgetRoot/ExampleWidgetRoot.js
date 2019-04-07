import React from 'react';
import { ExampleWidget } from '../ExampleWidget/ExampleWidget';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';
import { ExperimentsProvider } from '@wix/wix-experiments-react';

export class ExampleWidgetRoot extends React.Component {
  render() {
    const { name, locale, experiments } = this.props;

    return (
      <I18nextProvider i18n={i18n(locale)}>
        <ExperimentsProvider options={{ experiments }}>
          <ExampleWidget name={name} />
        </ExperimentsProvider>
      </I18nextProvider>
    );
  }
}
