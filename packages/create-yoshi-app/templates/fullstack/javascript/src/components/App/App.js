import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import s from './App.scss';

/* <-- To remove demo stuff just copy-paste:
  \{?/\*\s?<--([\n\n]|.)*?-->\s?\*\/\}?
  to your search input with RegExp enabled and remove everything matched.
--> */

class App extends React.Component {
  static propTypes = {
    t: PropTypes.func,
  };

  /* <-- Feel free to remove this lifecycle hook */
  state = {};
  async componentDidMount() {
    await import(
      /* webpackIgnore: true */
      // eslint-disable-next-line import/no-unresolved
      'https://unpkg.com/yoshi-template-intro@latest'
    );
    const { default: TemplateIntro } = window.TemplateIntro;
    this.setState({ TemplateIntro });
  } /* --> */

  render() {
    const { t } = this.props;

    return (
      <div className={s.root}>
        {/* <-- Feel free to remove h2 and TemplateIntro */}
        <h2 className={s.title} data-testid="app-title">
          {t('app.title')}
        </h2>
        {this.state.TemplateIntro &&
          React.createElement(this.state.TemplateIntro)}
        {/* --> */}
      </div>
    );
  }
}

export default translate()(App);
