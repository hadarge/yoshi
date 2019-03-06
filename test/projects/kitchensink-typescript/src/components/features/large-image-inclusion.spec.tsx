import React from 'react';
import ReactDOM from 'react-dom';
import LargeImageInclusion from './large-image-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LargeImageInclusion />, div);
});
