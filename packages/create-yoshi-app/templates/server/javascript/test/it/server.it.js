import { expect } from 'chai';
import axios from 'axios';
import { env } from '../environment';

describe('API', () => {
  env.beforeAndAfter();

  it('should return a valid response', async () => {
    const url = env.mainApp.getUrl('/');
    const response = await axios.get(url);

    expect(response.data).to.deep.include({
      success: true,
      payload: 'Hello world!',
      petriScopes: ['foo', 'bar'],
    });
  });
});
