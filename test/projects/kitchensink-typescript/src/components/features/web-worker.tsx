import React from 'react';

export default class WebWorker extends React.Component {
  componentDidMount() {
    new Worker('web-worker.js');
  }

  render() {
    return <h1>Test Web Worker</h1>;
  }
}
