import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import * as s from './App.scss';

interface AppProps extends InjectedTranslateProps {}

class App extends React.Component<AppProps> {
  render() {
    const { t } = this.props;

    return (
      <div className={s.root}>
        <div className={s.header}>
          <h2 data-testid="app-title">{t('app.title')}</h2>
        </div>
        <p className={s.intro}>{t('app.intro')}</p>
      </div>
    );
  }
}

export default translate()(App);
