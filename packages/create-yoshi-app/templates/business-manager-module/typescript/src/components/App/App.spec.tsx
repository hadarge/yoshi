import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../__mocks__/i18n';
import App from './App';

describe('App', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.detach());

  it('renders a title correctly', () => {
    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
      { attachTo: document.createElement('div') },
    );

    expect(wrapper.find('h2').length).toEqual(1);
  });
});
