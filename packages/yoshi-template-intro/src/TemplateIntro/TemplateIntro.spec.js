import React from 'react';
import { mount } from 'enzyme';
import Intro from './TemplateIntro';

describe('Intro', () => {
  let wrapper;

  afterEach(() => wrapper.unmount());

  it('renders a title correctly', () => {
    wrapper = mount(<Intro />);

    expect(wrapper.find('img')).toHaveLength(1);
  });
});
