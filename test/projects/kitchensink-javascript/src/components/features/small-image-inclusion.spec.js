import React from 'react';
import ReactDOM from 'react-dom';
import SmallImageInclusion from './small-image-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SmallImageInclusion />, div);
});
