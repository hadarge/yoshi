import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import s from './App.scss';

class App extends React.Component {
  static propTypes = {
    t: PropTypes.func,
  };

  render() {
    const { t } = this.props;

    return (
      <div className={s.root}>
        <div className={s.header}>
          <h2>{t('app.title')}</h2>
        </div>
        <p className={s.intro}>{t('app.intro')}</p>
      </div>
    );
  }
}

export default translate()(App);
