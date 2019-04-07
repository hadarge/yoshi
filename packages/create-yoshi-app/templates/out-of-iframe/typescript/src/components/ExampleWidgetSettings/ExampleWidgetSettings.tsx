import * as React from 'react';
import * as css from './ExampleWidgetSettings.scss';
import './ExampleWidgetSettings.global.scss';
import { get } from 'lodash';
import {
  Slider,
  ColorPickerColorSpace,
  Divider,
  TextLabel,
} from '@wix/wix-base-ui';

interface IExampleWidgetSettingsState {
  backgroundColor: string;
  fontSize: number;
}

const defaultSettingsValues: IExampleWidgetSettingsState = {
  backgroundColor: '#ffffff',
  fontSize: 14,
};

export class ExampleWidgetSettings extends React.Component<
  {},
  IExampleWidgetSettingsState
> {
  state = defaultSettingsValues;

  componentDidMount() {
    window.Wix.Styles.getStyleParams(styleParams => {
      this.setState({
        backgroundColor: get(
          styleParams,
          'colors.backgroundColor.value',
          this.state.backgroundColor,
        ),
        fontSize: get(styleParams, 'fonts.fontSize.size', this.state.fontSize),
      });
    });
  }

  updateHeaderBackgroundColor = (backgroundColor: string) => {
    window.Wix.Styles.setColorParam('backgroundColor', {
      value: { color: false, opacity: 1, rgba: backgroundColor },
    });
    this.setState({ backgroundColor });
  };

  updateHeaderFontSize = (fontSize: number) => {
    window.Wix.Styles.setFontParam('fontSize', {
      value: {
        family: 'roboto-bold',
        fontStyleParam: true,
        preset: 'Custom',
        size: fontSize,
        style: { bold: false, italic: false, underline: false },
        value: `font:normal normal normal ${fontSize}px/1em roboto-bold,roboto,sans-serif;`,
      },
    });
    this.setState({ fontSize });
  };

  render() {
    return (
      <div>
        <section className={css.section}>
          <TextLabel
            type="T02"
            value="Background color"
            shouldTranslate={false}
          />
          <div className={css.colorPicker}>
            <ColorPickerColorSpace
              onChange={this.updateHeaderBackgroundColor}
              value={this.state.backgroundColor}
            />
          </div>
        </section>
        <Divider long={true} />
        <section className={css.section}>
          <TextLabel
            type="T02"
            value="Font size (px)"
            shouldTranslate={false}
          />
          <Slider
            value={this.state.fontSize}
            onChange={this.updateHeaderFontSize}
          />
        </section>
      </div>
    );
  }
}
