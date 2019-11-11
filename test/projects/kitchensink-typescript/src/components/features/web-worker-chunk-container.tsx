import React from 'react';
import * as Worker from './web-worker-chunk-entry.inline.worker.ts';

interface Props {}

interface State {
  text: string;
}

export default class WebWorker extends React.Component<Props, State> {
  private worker = new Worker();

  constructor(props: Props) {
    super(props);

    this.state = { text: '' };
  }

  componentDidMount() {
    this.worker.addEventListener('message', () => {
      this.setState({ text: 'event from web worker' });
    });
  }

  render() {
    return <h1 id="worker-text">{this.state.text}</h1>;
  }
}
