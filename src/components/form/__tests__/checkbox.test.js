import React from 'react';
import Checkbox from '../checkbox';
import { helpers } from '../../../common';

describe('Checkbox Component', () => {
  let testModeMock;

  beforeEach(() => {
    testModeMock = mockObjectProperty(helpers, 'TEST_MODE', false);
  });

  afterEach(() => {
    testModeMock.mockClear();
  });

  it('should render an unchecked checkbox by default', () => {
    const component = renderComponent(<Checkbox />);
    const input = component.find('input');

    expect(input.type).toBe('checkbox');
    expect(input.value).toBe('');
    expect(input.checked).toBe(false);
    expect(input.disabled).toBe(false);
    expect(input.readOnly).toBe(false);
    expect(input.name).not.toBe('');
    expect(input.id).toBe(input.name);
    expect(component.querySelector('label')).toBeNull();
  });

  it('should use the name as the id when no id is provided', () => {
    const component = renderComponent(<Checkbox name="newsletter">Subscribe</Checkbox>);
    const input = component.find('input');

    expect(input.name).toBe('newsletter');
    expect(input.id).toBe('newsletter');
    expect(component.querySelector('label').control).toBe(input);
  });

  it('should treat a null checked value as unchecked', () => {
    const component = renderComponent(<Checkbox isChecked={null} />);
    const input = component.find('input');

    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(false);
  });

  it('should handle readOnly, disabled, checked', () => {
    const component = renderComponent(<Checkbox isReadOnly />);
    const input = component.find('input');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
    expect(input.checked).toBe(false);

    component.rerender(<Checkbox isDisabled />);

    expect(component.find('input')).toBe(input);
    expect(input.readOnly).toBe(false);
    expect(input.disabled).toBe(true);
    expect(input.checked).toBe(false);

    component.rerender(<Checkbox />);

    expect(input.readOnly).toBe(false);
    expect(input.disabled).toBe(false);
    expect(input.checked).toBe(false);

    component.rerender(<Checkbox isChecked />);

    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(false);
    expect(input.readOnly).toBe(false);

    component.rerender(<Checkbox isChecked={false} />);

    expect(input.checked).toBe(false);
  });

  it('should use children before the label prop and forward accessibility props', () => {
    const component = renderComponent(
      <Checkbox label="Fallback label" aria-describedby="checkbox-description">
        lorem ipsum
      </Checkbox>
    );
    const input = component.find('input');
    const label = component.querySelector('label');

    expect(label.textContent).toBe('lorem ipsum');
    expect(label.control).toBe(input);
    expect(input.getAttribute('aria-label')).toBe('lorem ipsum');
    expect(input.getAttribute('aria-describedby')).toBe('checkbox-description');
  });

  it('should use the label as the accessible name and let ariaLabel override it', () => {
    const component = renderComponent(<Checkbox label="Terms and conditions" />);
    const input = component.find('input');
    const label = component.querySelector('label');

    expect(label.textContent).toBe('Terms and conditions');
    expect(input.getAttribute('aria-label')).toBe('Terms and conditions');

    const overridden = renderComponent(<Checkbox label="Terms and conditions" ariaLabel="Accept terms" />);
    expect(overridden.querySelector('label').textContent).toBe('Terms and conditions');
    expect(overridden.find('input').getAttribute('aria-label')).toBe('Accept terms');
  });

  it('should pass checkbox values to the onChange callback', () => {
    const props = {
      id: 'checkbox-id',
      name: 'newsletter',
      value: 'weekly',
      onChange: jest.fn()
    };

    const component = renderComponent(<Checkbox {...props}>lorem ipsum</Checkbox>);
    const input = component.find('input');

    expect(input.id).toBe(props.id);
    expect(input.name).toBe(props.name);
    expect(input.value).toBe(props.value);
    component.fireEvent.click(input);

    expect(input.checked).toBe(true);
    expect(props.onChange).toHaveBeenCalledTimes(1);
    const changeEvent = props.onChange.mock.calls[0][0];
    expect(changeEvent).toMatchObject({
      id: props.id,
      name: props.name,
      value: props.value,
      checked: true,
      persist: expect.any(Function)
    });
    expect(changeEvent.currentTarget).toBe(input);
    expect(changeEvent.target).toBe(input);

    component.fireEvent.click(input);

    expect(input.checked).toBe(false);
    expect(props.onChange).toHaveBeenCalledTimes(2);
    const uncheckedEvent = props.onChange.mock.calls[1][0];
    expect(uncheckedEvent).toMatchObject({
      id: props.id,
      name: props.name,
      value: props.value,
      checked: false,
      persist: expect.any(Function)
    });
    expect(uncheckedEvent.currentTarget).toBe(input);
    expect(uncheckedEvent.target).toBe(input);
  });

  it('should report generated identifiers and an undefined value when no value is supplied', () => {
    const onChange = jest.fn();
    const component = renderComponent(<Checkbox onChange={onChange}>lorem ipsum</Checkbox>);
    const input = component.find('input');

    component.fireEvent.click(input);

    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    const changeEvent = onChange.mock.calls[0][0];
    expect(changeEvent).toMatchObject({
      id: input.id,
      name: input.name,
      value: undefined,
      checked: true,
      persist: expect.any(Function)
    });
    expect(changeEvent.currentTarget).toBe(input);
    expect(changeEvent.target).toBe(input);
  });
});
