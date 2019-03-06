import React from 'react';
import ReactDOM from 'react-dom';
import JsonInclusion from './json-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<JsonInclusion />, div);
});
