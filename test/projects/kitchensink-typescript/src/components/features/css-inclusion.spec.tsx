import React from 'react';
import ReactDOM from 'react-dom';
import CssInclusion from './css-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CssInclusion />, div);
});
