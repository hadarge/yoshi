import React from 'react';
import ReactDOM from 'react-dom';
import styles from './components/features/assets/style.css';

console.log(styles);

import('./components/features/css-inclusion').then(CssInclusion => {
  ReactDOM.render(<CssInclusion.default />, document.getElementById('root'));
});
