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
  /* <-- Please also remove `yoshi-template-intro` from your package.json */
  state = {
    TemplateIntro: () => null,
  };
  async componentDidMount() {
    const { default: TemplateIntro } = await import('yoshi-template-intro');
    this.setState({ TemplateIntro });
  } /* --> */

  render() {
    const { t } = this.props;

    return (
      <div className={s.root}>
        <h2 className={s.title} data-testid="app-title">
          {t('app.title')}
        </h2>
        {/* <-- Feel free to remove TemplateIntro */}
        <this.state.TemplateIntro />
        {/* --> */}
      </div>
    );
  }
}

export default translate()(App);
