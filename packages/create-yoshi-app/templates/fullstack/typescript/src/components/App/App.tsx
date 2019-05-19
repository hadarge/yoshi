import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import * as s from './App.scss';

/* <-- To remove demo stuff just copy-paste:
  \{?/\*\s?<--([\n\n]|.)*?-->\s?\*\/\}?
  to your search input with RegExp enabled and remove everything matched.
--> */

interface AppProps extends InjectedTranslateProps {}

class App extends React.Component<AppProps> {
  /* <-- Feel free to remove this lifecycle hook and state */
  state = {
    TemplateIntro: () => null,
  };
  async componentDidMount() {
    await import(
      /* webpackIgnore: true */
      // @ts-ignore
      'https://unpkg.com/yoshi-template-intro@latest'
    );
    const { default: TemplateIntro } = (window as any).TemplateIntro;
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
        <this.state.TemplateIntro />
        {/* --> */}
      </div>
    );
  }
}

export default translate()(App);
