import React from 'react';
import ReactDOM from 'react-dom';
import InlineSvgInclusion from './inline-svg-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InlineSvgInclusion />, div);
});
