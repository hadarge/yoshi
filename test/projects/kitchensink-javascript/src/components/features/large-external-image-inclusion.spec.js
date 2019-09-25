import React from 'react';
import ReactDOM from 'react-dom';
import LargeExternalImageInclusion from './large-external-image-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LargeExternalImageInclusion />, div);
});
