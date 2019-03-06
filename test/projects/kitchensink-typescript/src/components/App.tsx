import React, {
  Component,
  createElement,
  ComponentClass,
  FunctionComponent,
} from 'react';

interface Props {}

interface State {
  feature: null | ComponentClass<any, any> | FunctionComponent<any>;
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { feature: null };
  }

  async componentDidMount() {
    const featureName = window.location.pathname.slice(1);

    /* eslint-disable prettier/prettier */
    const {
      default: feature,
    } = await import(
      /* webpackChunkName: "[request]" */
      /* webpackExclude: /(assets|\.spec)/ */
      `./features/${featureName}`
    );
    /* eslint-enable prettier/prettier */

    this.setState({ feature });
  }

  render() {
    const { feature } = this.state;

    if (feature !== null) {
      return <div>{createElement(feature)}</div>;
    }

    return null;
  }
}
