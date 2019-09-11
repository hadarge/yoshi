import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { HttpProvider } from 'yoshi-server-react';
import MockHttpClient from 'yoshi-server-testing';
import { greet } from '../../api/greeting.api';
import App from './App';

function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const greetMock = {
  request: {
    fn: greet,
    variables: [12],
  },
  result: () => ({
    name: 'foo',
    age: 12,
  }),
};

const client = new MockHttpClient([greetMock]);

describe('App', () => {
  it('renders a title correctly', async () => {
    const container = document.createElement('div');

    act(() => {
      ReactDOM.render(
        <HttpProvider client={client}>
          <App />
        </HttpProvider>,
        container,
      );
    });

    expect(
      container.querySelector('[data-testid="loading"]')!.textContent,
    ).toBe('Loading...');

    await wait(0);

    expect(container.querySelector('[data-testid="title"]')!.textContent).toBe(
      'hello foo',
    );
  });
});
