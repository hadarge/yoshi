import React from 'react';
import query from './assets/query.graphql';

export default () => (
  <div
    id="graphql-inclusion"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(query) }}
  />
);
