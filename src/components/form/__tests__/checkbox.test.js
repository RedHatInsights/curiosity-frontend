import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../checkbox';

describe('Checkbox Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = mount(<Checkbox {...props} />);
    expect(component.render()).toMatchSnapshot('basic checkbox');
  });

  it('should handle readOnly as isDisabled', () => {
    const props = {
      readOnly: true
    };

    const component = mount(<Checkbox {...props} />);
    expect(component.render()).toMatchSnapshot('readOnly checkbox');

    component.setProps({
      readOnly: false,
      isDisabled: true
    });

    expect(component.render()).toMatchSnapshot('isDisabled checkbox');

    component.setProps({
      readOnly: false,
      isDisabled: false
    });

    expect(component.render()).toMatchSnapshot('active checkbox');
  });

  it('should handle children as a label', () => {
    const props = {};
    const component = mount(<Checkbox {...props}>lorem ipsum</Checkbox>);
    expect(component.render()).toMatchSnapshot('children label checkbox');
  });

  it('should return an emulated onchange event', done => {
    const props = {};

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = mount(<Checkbox {...props}>lorem ipsum</Checkbox>);
    component.find('input').simulate('change');
  });
});
