import React from 'react';
import TextInput from '../textInput';
import { helpers } from '../../../common';

describe('TextInput Component', () => {
  let testModeMock;

  beforeEach(() => {
    testModeMock = mockObjectProperty(helpers, 'TEST_MODE', false);
  });

  afterEach(() => {
    testModeMock.mockClear();
  });

  it('should render an empty text input by default', () => {
    const component = renderComponent(<TextInput />);
    const input = component.find('input');

    expect(input.type).toBe('text');
    expect(input.value).toBe('');
    expect(input.readOnly).toBe(false);
    expect(input.disabled).toBe(false);
    expect(input.name).not.toBe('');
    expect(input.id).toBe(input.name);
  });

  it('should use the name as the id when no id is provided', () => {
    const component = renderComponent(<TextInput name="search-query" />);
    const input = component.find('input');

    expect(input.name).toBe('search-query');
    expect(input.id).toBe('search-query');
  });

  it('should handle readOnly, disabled', () => {
    const component = renderComponent(<TextInput isReadOnly />);
    const input = component.find('input');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);

    component.rerender(<TextInput isDisabled />);

    expect(component.find('input')).toBe(input);
    expect(input.readOnly).toBe(false);
    expect(input.disabled).toBe(true);

    component.rerender(<TextInput />);

    expect(input.readOnly).toBe(false);
    expect(input.disabled).toBe(false);
  });

  it('should preserve its styling hook and forward custom classes and input attributes', () => {
    const component = renderComponent(
      <TextInput className="search-query" aria-label="Filter by display name" placeholder="Search" maxLength={255} />
    );
    const input = component.find('input');

    expect(input.closest('.curiosity-text-input.search-query')).not.toBeNull();
    expect(input.getAttribute('aria-label')).toBe('Filter by display name');
    expect(input.placeholder).toBe('Search');
    expect(input.maxLength).toBe(255);
  });

  it('should update its value and pass the change event to onChange', () => {
    const props = {
      id: 'text-input-id',
      name: 'text-input-name',
      value: 'lorem ipsum',
      onChange: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    expect(input.id).toBe(props.id);
    expect(input.name).toBe(props.name);
    expect(input.value).toBe('lorem ipsum');

    component.fireEvent.change(input, { target: { value: 'dolor sit' } });

    expect(input.value).toBe('dolor sit');
    expect(props.onChange).toHaveBeenCalledTimes(1);
    const changeEvent = props.onChange.mock.calls[0][0];
    expect(changeEvent).toMatchObject({
      id: props.id,
      name: props.name,
      value: 'dolor sit',
      persist: expect.any(Function)
    });
    expect(changeEvent.currentTarget).toBe(input);
    expect(changeEvent.target).toBe(input);
    expect(props.onClear).not.toHaveBeenCalled();
  });

  it.each([
    ['text', 'Enter', 13],
    ['text', 'a', 65],
    ['search', 'Enter', 13],
    ['search', 'a', 65]
  ])('should forward %s input key-up events for %s without clearing', (type, key, keyCode) => {
    const props = {
      id: 'query-id',
      name: 'query',
      type,
      value: 'search text',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };
    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');

    component.fireEvent.keyUp(input, { keyCode, which: keyCode, key });

    expect(input.value).toBe(props.value);
    expect(props.onClear).not.toHaveBeenCalled();
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    const keyEvent = props.onKeyUp.mock.calls[0][0];
    expect(keyEvent).toMatchObject({
      id: props.id,
      name: props.name,
      keyCode,
      value: props.value,
      persist: expect.any(Function)
    });
    expect(keyEvent.currentTarget).toBe(input);
    expect(keyEvent.target).toBe(input);
  });

  it('should clear its value and pass an onClear event on Escape', () => {
    const props = {
      id: 'test-id',
      name: 'test-input-name',
      value: 'lorem ipsum',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');
    component.fireEvent.keyUp(input, { keyCode: 27, which: 27, key: 'Escape' });

    expect(input.value).toBe('');
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onKeyUp.mock.calls[0][0]).toMatchObject({
      id: props.id,
      name: props.name,
      keyCode: 27,
      value: props.value,
      persist: expect.any(Function)
    });
    expect(props.onClear).toHaveBeenCalledTimes(1);
    const clearEvent = props.onClear.mock.calls[0][0];
    expect(clearEvent).toMatchObject({
      keyCode: 27,
      value: '',
      persist: expect.any(Function)
    });
    expect(clearEvent.currentTarget.value).toBe('');
    expect(clearEvent.target).toBe(input);
  });

  it('should pass Escape through onClear for an empty search input', () => {
    const props = {
      type: 'search',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');

    expect(input.type).toBe('search');
    component.fireEvent.keyUp(input, { keyCode: 27, which: 27, key: 'Escape' });

    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(props.onClear.mock.calls[0][0]).toMatchObject({
      id: input.id,
      name: input.name,
      keyCode: 27,
      value: '',
      persist: expect.any(Function)
    });
  });

  it('should clear a nonempty search input on Escape', () => {
    const props = {
      type: 'search',
      value: 'lorem ipsum',
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');

    component.fireEvent.keyUp(input, { keyCode: 27, which: 27, key: 'Escape' });

    expect(input.value).toBe('');
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    const clearEvent = props.onClear.mock.calls[0][0];
    expect(clearEvent).toMatchObject({
      keyCode: 27,
      value: '',
      persist: expect.any(Function)
    });
    expect(clearEvent.currentTarget.value).toBe('');
    expect(clearEvent.target).toBe(input);
  });

  it.each([
    ['text', 'lorem ipsum'],
    ['text', ''],
    ['search', 'lorem ipsum'],
    ['search', '']
  ])('should forward mouse-up events for a %s input with value "%s" without clearing', (type, value) => {
    const props = {
      id: 'query-id',
      name: 'query',
      type,
      value,
      onMouseUp: jest.fn(),
      onClear: jest.fn()
    };

    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');

    component.fireEvent.mouseUp(input);

    expect(input.value).toBe(value);
    expect(props.onMouseUp).toHaveBeenCalledTimes(1);
    const mouseEvent = props.onMouseUp.mock.calls[0][0];
    expect(mouseEvent).toMatchObject({
      id: props.id,
      name: props.name,
      value,
      persist: expect.any(Function)
    });
    expect(mouseEvent.currentTarget).toBe(input);
    expect(mouseEvent.target).toBe(input);
    expect(props.onClear).not.toHaveBeenCalled();
  });

  it('should notify onClear once when Escape natively clears a search input before key-up', () => {
    const props = {
      id: 'query-id',
      name: 'query',
      type: 'search',
      value: 'search text',
      onChange: jest.fn(),
      onKeyUp: jest.fn(),
      onClear: jest.fn()
    };
    const component = renderComponent(<TextInput {...props} />);
    const input = component.find('input');

    component.fireEvent.input(input, { target: { value: '' } });
    component.fireEvent.keyUp(input, { keyCode: 27, which: 27, key: 'Escape' });

    expect(input.value).toBe('');
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onKeyUp).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    const clearEvent = props.onClear.mock.calls[0][0];
    expect(clearEvent).toMatchObject({
      id: props.id,
      name: props.name,
      keyCode: 27,
      value: '',
      persist: expect.any(Function)
    });
    expect(clearEvent.currentTarget).toBe(input);
    expect(clearEvent.target).toBe(input);
  });

  it('should preserve edited text and use updated callbacks after rerendering', () => {
    const originalCallbacks = {
      onChange: jest.fn(),
      onClear: jest.fn(),
      onKeyUp: jest.fn(),
      onMouseUp: jest.fn()
    };
    const updatedCallbacks = {
      onChange: jest.fn(),
      onClear: jest.fn(),
      onKeyUp: jest.fn(),
      onMouseUp: jest.fn()
    };
    const component = renderComponent(<TextInput value="initial text" {...originalCallbacks} />);
    const input = component.find('input');
    component.fireEvent.change(input, { target: { value: 'edited text' } });
    originalCallbacks.onChange.mockClear();

    component.rerender(<TextInput value="initial text" {...updatedCallbacks} />);

    expect(component.find('input')).toBe(input);
    expect(input.value).toBe('edited text');
    component.fireEvent.change(input, { target: { value: 'updated text' } });
    component.fireEvent.keyUp(input, { keyCode: 13, which: 13, key: 'Enter' });
    component.fireEvent.mouseUp(input);
    component.fireEvent.keyUp(input, { keyCode: 27, which: 27, key: 'Escape' });

    expect(input.value).toBe('');
    expect(updatedCallbacks.onChange).toHaveBeenCalledTimes(1);
    expect(updatedCallbacks.onKeyUp).toHaveBeenCalledTimes(2);
    expect(updatedCallbacks.onMouseUp).toHaveBeenCalledTimes(1);
    expect(updatedCallbacks.onClear).toHaveBeenCalledTimes(1);
    Object.values(originalCallbacks).forEach(callback => expect(callback).not.toHaveBeenCalled());
  });
});
