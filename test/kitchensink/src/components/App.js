import React, { Component, createElement } from 'react';

export default class App extends Component {
  constructor(props) {
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
      /* webpackExclude: /assets/ */
      `./features/${featureName}`,
    );
    /* eslint-enable prettier/prettier */

    this.setState({ feature });
  }

  render() {
    const { feature } = this.state;

    if (feature !== null) {
      return <div>{createElement(this.state.feature)}</div>;
    }

    return null;
  }
}
