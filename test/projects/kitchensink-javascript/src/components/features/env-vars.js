import React from 'react';

export default () => (
  <div id="env-vars">
    <p id="node-env">{process.env.NODE_ENV}</p>
    <p id="ci-app-version">{window.__CI_APP_VERSION__}</p>
  </div>
);
