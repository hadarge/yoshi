import * as React from 'react';
import { mount } from 'enzyme/build';
import { ExampleWidgetSettings } from './ExampleWidgetSettings';
import { Slider, ColorPickerColorSpace } from '@wix/wix-base-ui';

describe('Example Widget Settings', () => {
  let wrapper;

  const styleParams = {
    colors: {
      backgroundColor: {
        value: '#F8EE28',
      },
    },
    fonts: {
      fontSize: {
        size: 16,
      },
    },
  };

  window.Wix = {
    Styles: {
      getStyleParams: callback => callback(styleParams),
      setFontParam: () => {},
    } as any,
  } as any;

  afterEach(() => wrapper.unmount());

  it('should render a color picker component', () => {
    wrapper = mount(<ExampleWidgetSettings />);
    expect(wrapper.find(ColorPickerColorSpace).exists()).toBe(true);
  });

  it('should render a font size picker', () => {
    wrapper = mount(<ExampleWidgetSettings />);
    expect(wrapper.find(Slider).exists()).toBe(true);
  });
});
