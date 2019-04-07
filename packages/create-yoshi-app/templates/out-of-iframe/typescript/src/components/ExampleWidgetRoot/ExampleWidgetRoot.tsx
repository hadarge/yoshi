import * as React from 'react';
import { ExampleWidget } from '../ExampleWidget/ExampleWidget';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';
import { ExperimentsProvider } from '@wix/wix-experiments-react';
import { ExperimentsBag } from '@wix/wix-experiments';
import { IHostProps } from '@wix/native-components-infra/dist/src/types/types';

interface IExampleWidgetRootProps {
  name: string;
  locale: string;
  experiments: ExperimentsBag;
  host?: IHostProps;
}

export class ExampleWidgetRoot extends React.PureComponent<
  IExampleWidgetRootProps
> {
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
