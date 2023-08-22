import React from 'react';
import Checkbox from '../checkbox';
import { helpers } from '../../../common/helpers';

describe('Checkbox Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<Checkbox {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should handle readOnly, disabled, checked', () => {
    const props = {
      isReadOnly: true
    };

    const component = renderComponent(<Checkbox {...props} />);
    expect(component.find('input')).toMatchSnapshot('readOnly');

    const dis = component.setProps({
      isReadOnly: false,
      isDisabled: true
    });

    expect(dis.find('input')).toMatchSnapshot('disabled');

    const active = component.setProps({
      isReadOnly: false,
      isDisabled: false
    });

    expect(active.find('input')).toMatchSnapshot('active');

    const checked = component.setProps({
      isReadOnly: false,
      isDisabled: false,
      isChecked: true
    });

    expect(checked.find('input')).toMatchSnapshot('checked');
  });

  it('should handle children as a label', () => {
    const props = {};
    const component = renderComponent(<Checkbox {...props}>lorem ipsum</Checkbox>);
    expect(component).toMatchSnapshot('children label checkbox');
  });

  it('should return an emulated onChange event', () => {
    const props = {
      onChange: jest.fn()
    };

    const component = renderComponent(<Checkbox {...props}>lorem ipsum</Checkbox>);
    const input = component.find('input');
    const mockEvent = { currentTarget: {}, target: {}, checked: true, persist: helpers.noop };
    component.fireEvent.click(input, mockEvent);

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange.mock.calls).toMatchSnapshot('emulated event, change');
  });
});
