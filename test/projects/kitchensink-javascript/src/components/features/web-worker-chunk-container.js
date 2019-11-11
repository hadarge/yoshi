import React from 'react';
import Worker from './web-worker-chunk-entry.inline.worker';

export default class WebWorker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };
  }

  componentDidMount() {
    this.worker = new Worker();
    this.worker.addEventListener('message', () => {
      this.setState({ text: 'event from web worker' });
    });
  }

  render() {
    return <h1 id="worker-text">{this.state.text}</h1>;
  }
}
