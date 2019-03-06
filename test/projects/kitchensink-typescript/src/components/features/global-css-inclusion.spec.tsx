import React from 'react';
import ReactDOM from 'react-dom';
import GlobalCssInclusion from './global-css-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GlobalCssInclusion />, div);
});
