import React from 'react';
import { I18nextProvider, translate } from 'react-i18next';
import {
  ExperimentsProvider,
  withExperiments,
} from '@wix/wix-experiments-react';
import { Button } from 'wix-ui-tpa/Button';
import i18n from '../../config/i18n';
import styles from './App.st.css';

export default class AppRoot extends React.Component {
  render() {
    const { name, locale, experiments } = this.props;

    return (
      <I18nextProvider i18n={i18n(locale)}>
        <ExperimentsProvider options={{ experiments }}>
          <App name={name} />
        </ExperimentsProvider>
      </I18nextProvider>
    );
  }
}

export const App = withExperiments(
  translate()(({ name, t, ...rest }) => {
    return (
      <div {...styles('root', {}, rest)}>
        <div className={styles.header}>
          <h2>
            {t('app.hello')} {name}!
          </h2>
        </div>
        <Button className={styles.mainButton}>click me</Button>
      </div>
    );
  }),
);
