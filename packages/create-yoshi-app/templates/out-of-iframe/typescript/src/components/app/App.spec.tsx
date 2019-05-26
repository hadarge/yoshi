import * as React from 'react';
import { mount } from 'enzyme';
import { App } from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../__tests__/helpers/i18n.mock';
import { ExperimentsProvider } from '@wix/wix-experiments-react';

describe('App', () => {
  let wrapper;

  afterEach(() => wrapper.unmount());

  it('should render a title correctly', async () => {
    const name = 'World';

    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <ExperimentsProvider options={{ experiments: {} }}>
          <App name={name} />
        </ExperimentsProvider>
      </I18nextProvider>,
    );

    const key = 'app.hello';

    expect(wrapper.find('h2').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe(`${key} ${name}!`);
  });
});
