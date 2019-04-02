import React from 'react';
import ReactDOM from 'react-dom';
import GraphqlInclusion from './graphql-inclusion';

it('should pass', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GraphqlInclusion />, div);
});
