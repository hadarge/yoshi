import React from 'react';
import ReactDOM from 'react-dom';
import SassInclusion from './sass-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SassInclusion />, div);
});
