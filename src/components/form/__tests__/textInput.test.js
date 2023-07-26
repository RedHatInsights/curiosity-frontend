import React from 'react';
import TextInput from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled', () => {
    const props = {
      isReadOnly: true
    };

    const component = renderComponent(<TextInput {...props} />);
    expect(component).toMatchSnapshot('readOnly');

    const propsUpdatedDisabled = component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(propsUpdatedDisabled).toMatchSnapshot('disabled');

    const propsUpdatedActive = component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(propsUpdatedActive).toMatchSnapshot('active');
  });

  it('should return an emulated onChange event', () => {
    const props = {
      value: 'lorem ipsum'
    };

    const component = renderComponent(<TextInput {...props} />);
    const mockEvent = { target: { value: 'dolor sit' }, persist: helpers.noop };
    const input = component.find('input');
    component.fireEvent.change(input, mockEvent);
    expect(input.value).toMatchSnapshot('emulated event, change');
  });

  it('should return an emulated onClear event on escape', () => {
    const props = {
      id: 'test-id',
      value: 'lorem ipsum',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    const mockEvent = { target: { value: '' }, keyCode: 27, which: 27, key: 'Escape', persist: helpers.noop };
    component.fireEvent.keyUp(input, mockEvent);

    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(props.onClear.mock.calls).toMatchSnapshot('emulated event, esc');
  });
});
