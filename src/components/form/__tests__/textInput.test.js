import React from 'react';
import { mount, shallow } from 'enzyme';
import TextInput from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = shallow(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled', () => {
    const props = {
      isReadOnly: true
    };

    const component = mount(<TextInput {...props} />);
    expect(component.render()).toMatchSnapshot('readOnly');

    component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(component.render()).toMatchSnapshot('disabled');

    component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(component.render()).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', done => {
    const props = {
      value: 'lorem ipsum'
    };

    props.onChange = event => {
      expect(event).toMatchSnapshot('emulated event, change');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: 'dolor sit' }, persist: helpers.noop };
    component.instance().onChange('dolor sit', mockEvent);
  });

  it('should return an emulated onClear event on escape', done => {
    const props = {
      value: 'lorem ipsum'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event, esc');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.instance().onKeyUp(mockEvent);
  });

  it('should return an emulated onClear event on escape with type search', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event, esc, type search');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.instance().onKeyUp(mockEvent);
  });

  it('should return an emulated onClear event on search clear', done => {
    const props = {
      value: 'lorem ipsum',
      type: 'search'
    };

    props.onClear = event => {
      expect(event).toMatchSnapshot('emulated event, clear');
      done();
    };

    const component = shallow(<TextInput {...props} />);
    const mockEvent = { currentTarget: { value: 'lorem ipsum' }, persist: helpers.noop };
    component.instance().onMouseUp(mockEvent);
    mockEvent.currentTarget.value = '';
  });
});
