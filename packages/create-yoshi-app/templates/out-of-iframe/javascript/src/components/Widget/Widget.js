import React from 'react';
import { I18nextProvider, translate } from 'react-i18next';
import {
  ExperimentsProvider,
  withExperiments,
} from '@wix/wix-experiments-react';
import { TPAComponentsProvider } from 'wix-ui-tpa/TPAComponentsConfig';
import { Button } from 'wix-ui-tpa/Button';
import i18n from '../../config/i18n';
import styles from './Widget.st.css';

export default class WidgetRoot extends React.Component {
  render() {
    const { name, language, experiments, mobile } = this.props;

    return (
      <I18nextProvider i18n={i18n(language)}>
        <ExperimentsProvider options={{ experiments }}>
          <TPAComponentsProvider value={{ mobile }}>
            <Widget name={name} />
          </TPAComponentsProvider>
        </ExperimentsProvider>
      </I18nextProvider>
    );
  }
}

export const Widget = withExperiments(
  translate()(({ name, t, ...rest }) => {
    return (
      <div {...styles('root', {}, rest)}>
        <div className={styles.header}>
          <h2 data-testid="app-title">
            {t('app.hello')} {name}!
          </h2>
        </div>
        <Button className={styles.mainButton}>click me</Button>
      </div>
    );
  }),
);
