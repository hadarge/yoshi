import * as React from 'react';
import { translate } from 'react-i18next';
import { withExperiments } from '@wix/wix-experiments-react';
import { ButtonNext as Button } from 'wix-ui-core/button-next';
import styles from './ExampleWidget.st.css';
import { TranslationFunction } from 'i18next';

interface IExampleWidgetProps {
  name: string;
  t: TranslationFunction;
}

class ExampleWidgetComponent extends React.PureComponent<IExampleWidgetProps> {
  render() {
    const { t, name } = this.props;
    return (
      <div {...styles('root', {}, this.props)}>
        <div className={styles.header}>
          <h2>
            {t('app.hello')} {name}!
          </h2>
        </div>
        <Button className={styles.mainButton}>click me</Button>
      </div>
    );
  }
}

export const ExampleWidget = withExperiments<any>(
  translate()<IExampleWidgetProps>(ExampleWidgetComponent),
);
