import React, { Component, createElement } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { feature: null };
  }

  async componentDidMount() {
    const featureName = window.location.pathname.slice(1);

    const {
      default: feature,
    } = await import(/* webpackChunkName: "[request]" */ `./features/${featureName}`);

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
