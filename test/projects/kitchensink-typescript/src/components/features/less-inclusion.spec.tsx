import React from 'react';
import ReactDOM from 'react-dom';
import LessInclusion from './less-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LessInclusion />, div);
});
