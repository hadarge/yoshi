import React from 'react';
import { translate } from 'react-i18next';
import { withExperiments } from '@wix/wix-experiments-react';
import { ButtonNext as Button } from 'wix-ui-core/button-next';
import styles from './ExampleWidget.st.css';

export const ExampleWidget = withExperiments(
  translate()(({ name, t, ...rest }) => {
    return (
      <div {...styles('root', {}, rest)}>
        <div className={styles.header}>
          <h2>
            {t('app.hello')} {name}!
          </h2>
        </div>
        <Button className={styles.mainButton}>click me</Button>
      </div>
    );
  }),
);
