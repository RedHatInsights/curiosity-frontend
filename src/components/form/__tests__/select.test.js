import React from 'react';
import {
  Select,
  SelectButtonVariant,
  useOnSelect,
  updateOptions,
  updateSelectedOptions,
  updateSelectedProp,
  updateDataAttributes,
  formatEvent,
  SelectVariant
} from '../select';

describe('helpers', () => {
  it('updateDataAttributes should update the data- attributes of a dom element', () => {
    const mockDomElement = document.createElement('div');
    mockDomElement.appendChild(document.createElement('span'));

    updateDataAttributes({ selectField: { current: mockDomElement }, 'data-hello': 'world' });
    expect(mockDomElement).toMatchSnapshot('attributes');
  });

  it.each([
    {
      options: 'lorem',
      description: 'string'
    },
    {
      options: ['lorem', 1, 2],
      description: 'string, number'
    },
    {
      options: [{ value: 'hello' }, { value: { world: 'world' } }],
      description: 'object'
    },
    {
      options: [NaN, undefined, null, 1, 'a'],
      description: 'null, undefined, NaN'
    }
  ])('updateOptions should allow an array of varied options, $description', ({ options }) => {
    expect(updateOptions(options)).toMatchSnapshot();
  });

  it.each([
    {
      options: 'a',
      description: 'string'
    },
    {
      options: 3,
      description: 'number'
    },
    {
      options: { value: 'hello' },
      description: 'object'
    },
    {
      options: null,
      description: 'null'
    },
    {
      options: undefined,
      description: 'undefined'
    },
    {
      options: NaN,
      description: 'NaN'
    },
    {
      options: ['a', 'b', 3, { value: 'hello' }],
      description: 'array'
    },
    {
      options: ['a', 'b', 3, { value: 'hello' }, null, undefined, NaN],
      description: 'null, undefined, NaN'
    }
  ])('updateSelectedOptions should only allow lists or any single option type, $description', ({ options }) => {
    expect(updateSelectedOptions(options)).toMatchSnapshot();
  });

  it.each([
    {
      options: ['a', 'b', 3],
      selectedOptions: undefined,
      description: 'none'
    },
    {
      options: ['a', 'b', 3],
      selectedOptions: 'a',
      description: 'string'
    },
    {
      options: ['a', 'b', 3],
      selectedOptions: 'a',
      description: 'number'
    },
    {
      options: ['a', { value: 'lorem ipsum', isSelected: true }, 3],
      selectedOptions: undefined,
      description: 'preselected'
    },
    {
      options: ['a', { value: 'lorem ipsum' }, 3],
      selectedOptions: 'lorem ipsum',
      description: 'object'
    },
    {
      options: ['a', { value: { data: 'lorem ipsum' } }, 3],
      selectedOptions: 'lorem ipsum',
      description: 'object as value'
    },
    {
      options: ['a', { value: 'lorem ipsum', isSelected: true }, { value: 3, isSelected: true }, 'b', 4],
      selectedOptions: undefined,
      variant: 'mock',
      description: 'multiple preselected'
    },
    {
      options: ['a', { value: 'lorem ipsum' }, 3, 'b', 4],
      selectedOptions: [3, 'a', 'lorem ipsum'],
      variant: 'mock',
      description: 'multiple'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: undefined,
      variant: 'mock',
      description: 'purposeful undefined value, this will fail'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: 'undefined',
      variant: 'mock',
      description: 'purposeful undefined as title string lookup'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: [undefined],
      variant: 'mock',
      description: 'purposeful undefined with required array lookup'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: null,
      variant: 'mock',
      description: 'purposeful null value'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: 'null',
      variant: 'mock',
      description: 'purposeful null value as title string lookup'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: [null],
      variant: 'mock',
      description: 'purposeful null value as array lookup'
    },
    {
      options: ['a', '', 3, 'b', 4],
      selectedOptions: '',
      variant: 'mock',
      description: 'purposeful empty value'
    },
    {
      options: ['a', '', 3, 'b', 4],
      selectedOptions: [''],
      variant: 'mock',
      description: 'purposeful empty value as array lookup'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: NaN,
      variant: 'mock',
      description: 'purposeful NaN value'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: 'NaN',
      variant: 'mock',
      description: 'purposeful NaN value as title string lookup'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: [NaN],
      variant: 'mock',
      description: 'purposeful NaN value as array lookup'
    }
  ])(
    'updateSelectedProp should add isSelected enhancements to options, $description',
    ({ options, selectedOptions, variant }) => {
      expect(
        updateSelectedProp({
          options: updateOptions(options),
          selectedOptions: updateSelectedOptions(selectedOptions),
          variant
        })
      ).toMatchSnapshot();
    }
  );

  it.each([
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: false },
        { title: 'ipsum', value: 'lorem', index: 'mock', isSelected: true }
      ],
      variant: SelectVariant.single,
      description: 'single'
    },
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: true },
        { title: 'ipsum', value: 'ipsum', index: 'mock', isSelected: false }
      ],
      variant: SelectVariant.dropdown,
      description: 'dropdown'
    },
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: true },
        { title: 'ipsum', value: 'ipsum', index: 'mock', isSelected: true }
      ],
      variant: SelectVariant.checkbox,
      description: 'multiple'
    }
  ])(
    'formatEvent should modify the event object for select by exposing selected, selectedIndex, select type, and value, $description',
    ({ options, variant }) => {
      expect(formatEvent({ options, variant })).toMatchSnapshot();
    }
  );
});

describe('useOnSelect', () => {
  it('should return specific properties', async () => {
    const { result } = await renderHook(() => useOnSelect({}));
    expect(result).toMatchSnapshot('properties');
  });

  it("should ignore returning updated options' state through the returned onSelect callback when option is disabled", async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() =>
      useOnSelect({ options: ['lorem', { title: 'ipsum', isDisabled: true }], onSelect })
    );

    result.onSelect(undefined, 'c1364870937');
    expect(onSelect.mock.calls).toMatchSnapshot('disabled');
  });

  it("should return updated options' state through the returned onSelect callback for default", async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() => useOnSelect({ options: ['lorem', 'ipsum'], onSelect }));

    result.onSelect(undefined, 'c1551355848');
    expect(onSelect.mock.calls).toMatchSnapshot('default');
  });

  it("should return updated options' state through the returned onSelect callback for checkboxes", async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() =>
      useOnSelect({ options: ['lorem', 'ipsum'], onSelect, variant: SelectVariant.checkbox })
    );

    result.onSelect(undefined, 'c1551355848');
    expect(onSelect.mock.calls).toMatchSnapshot('checkboxes');
  });

  it('should return consistent, updated options, and a selected title', async () => {
    const { result } = await renderHook(() => useOnSelect({ options: ['hello', 'world'], selectedOptions: ['hello'] }));
    expect(result).toMatchSnapshot('properties');
  });
});

describe('Select', () => {
  it('should render a single variant', () => {
    const props = {
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum' },
          { title: 'hello', value: 'world', isSelected: true }
        ],
        selectedOption: {
          title: 'hello',
          value: 'world',
          isSelected: true
        }
      })
    };

    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    expect(component).toMatchSnapshot('select');
  });

  it('should render a checkbox variant', () => {
    const props = {
      variant: SelectVariant.checkbox,
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum' },
          { title: 'hello', value: 'world' }
        ]
      })
    };
    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    expect(component).toMatchSnapshot('checklist');
  });

  it('should render a dropdown variant', () => {
    const props = {
      variant: SelectVariant.dropdown,
      toggle: { variant: SelectButtonVariant.secondary },
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum' },
          { title: 'hello', value: 'world' }
        ]
      })
    };
    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    expect(component).toMatchSnapshot('dropdown');
  });

  it('should return an emulated onselect/onchange event, single', () => {
    const mockOnSelect = jest.fn();
    const props = {
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum' },
          { title: 'hello', value: 'world', isSelected: true }
        ],
        selectedOption: {
          title: 'hello',
          value: 'world',
          isSelected: true
        },
        onSelect: mockOnSelect
      })
    };
    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    const optionButton = component.find('button.curiosity-select-pf__option');
    component.fireEvent.click(optionButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect.mock.calls).toMatchSnapshot('default emulated event');
  });

  it('should return an emulated onchange event, checkbox', () => {
    const mockOnSelect = jest.fn();
    const props = {
      variant: SelectVariant.checkbox,
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', isSelected: false },
          { title: 'hello', value: 'world', isSelected: false },
          { title: 'dolor', value: 'sit', isSelected: true }
        ],
        selectedOption: [],
        onSelect: mockOnSelect
      })
    };
    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));

    const firstCheckbox = component.find('label.curiosity-select-pf__option input');
    component.fireEvent.click(firstCheckbox);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    const secondCheckbox = component.querySelectorAll('label.curiosity-select-pf__option input')?.[1];
    component.fireEvent.click(secondCheckbox);
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });

  it('should allow being disabled with missing options', () => {
    const component = renderComponent(<Select options={undefined} />);
    component.fireEvent.click(component.find('button'));
    expect(component).toMatchSnapshot('no options');

    const componentNoOptions = renderComponent(<Select options={[]} />);
    componentNoOptions.fireEvent.click(componentNoOptions.find('button'));
    expect(componentNoOptions).toMatchSnapshot('options, but no content');

    const componentDisabled = renderComponent(<Select options={['lorem', 'ipsum', 'hello', 'world']} isDisabled />);
    componentDisabled.fireEvent.click(componentDisabled.find('button'));
    expect(componentDisabled).toMatchSnapshot('options, but disabled');
  });
});
