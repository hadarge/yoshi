import React from 'react';
import styles from './assets/style.css';

export default () => (
  <div>
    <p id="css-inclusion" className={styles['css-modules-inclusion']}>
      CSS Modules are working!
    </p>
  </div>
);
