import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from '../../../test/helpers/i18n.mock';

describe('App', () => {
  let wrapper;

  afterEach(() => wrapper.unmount());

  it('renders a title correctly', () => {
    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    );

    expect(wrapper.find('h2')).toHaveLength(1);
  });
});
