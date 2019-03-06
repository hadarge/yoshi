import React from 'react';
import ReactDOM from 'react-dom';
import SvgInclusion from './svg-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SvgInclusion />, div);
});
