import React from 'react';
import page from './assets/page.html';

export default () => (
  <div id="html-inclusion" dangerouslySetInnerHTML={{ __html: page }} />
);
