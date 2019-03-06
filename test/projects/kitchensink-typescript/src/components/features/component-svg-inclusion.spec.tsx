import React from 'react';
import ReactDOM from 'react-dom';
import ComponentSvgInclusion from './component-svg-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ComponentSvgInclusion />, div);
});
