import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { ExperimentsProvider } from '@wix/wix-experiments-react';
import i18n from '../../../__tests__/helpers/i18n.mock';
import { Widget } from './Widget';

describe('Widget', () => {
  it('should render a title correctly', async () => {
    const name = 'World';

    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <ExperimentsProvider options={{ experiments: {} }}>
          <Widget name={name} />
        </ExperimentsProvider>
      </I18nextProvider>,
    );

    const key = 'app.hello';

    expect(getByTestId('app-title').textContent).toBe(`${key} ${name}!`);
  });
});
