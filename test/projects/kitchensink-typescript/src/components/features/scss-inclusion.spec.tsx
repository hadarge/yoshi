import React from 'react';
import ReactDOM from 'react-dom';
import ScssInclusion from './scss-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ScssInclusion />, div);
});
