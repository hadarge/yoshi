import React from 'react';
import ReactDOM from 'react-dom';
import GlobalSassInclusion from './global-sass-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GlobalSassInclusion />, div);
});
