import React from 'react';
import ReactDOM from 'react-dom';
import GlobalScssInclusion from './global-scss-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GlobalScssInclusion />, div);
});
