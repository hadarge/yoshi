import React from 'react';
import ReactDOM from 'react-dom';
import HtmlInclusion from './html-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HtmlInclusion />, div);
});
