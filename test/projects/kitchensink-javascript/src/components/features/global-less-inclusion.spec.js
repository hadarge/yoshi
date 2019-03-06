import React from 'react';
import ReactDOM from 'react-dom';
import GlobalLessInclusion from './global-less-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GlobalLessInclusion />, div);
});
