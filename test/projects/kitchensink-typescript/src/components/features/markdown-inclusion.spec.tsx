import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownInclusion from './markdown-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MarkdownInclusion />, div);
});
