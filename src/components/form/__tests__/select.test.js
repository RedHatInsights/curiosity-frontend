import React from 'react';
import { act, renderHook as renderReactHook } from '@testing-library/react';
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

const normalizeSelectedOptions = options => {
  if (Array.isArray(options)) {
    return options;
  }

  if (!options) {
    return [];
  }

  return [options];
};

const summarizeOptions = options =>
  normalizeSelectedOptions(options).map(({ title, value, index, isSelected }) => ({
    title,
    value,
    index,
    isSelected
  }));

const getCheckboxInputs = component => [
  ...new Set(
    component.screen
      .getAllByRole('menu')
      .map(menu => menu.querySelector('input'))
      .filter(Boolean)
  )
];

describe('helpers', () => {
  it('updates data attributes on the select element child', () => {
    const mockDomElement = document.createElement('div');
    mockDomElement.appendChild(document.createElement('span'));

    updateDataAttributes({ selectField: { current: mockDomElement }, 'data-hello': 'world' });

    expect(mockDomElement.firstChild.getAttribute('data-hello')).toBe('world');
    expect(mockDomElement.hasAttribute('data-hello')).toBe(false);
  });

  it.each([
    {
      options: 'lorem',
      expected: [],
      description: 'string'
    },
    {
      options: ['lorem', 1, 2],
      expected: [
        { title: 'lorem', value: 'lorem', index: 0, isSelected: false },
        { title: '1', value: 1, index: 1, isSelected: false },
        { title: '2', value: 2, index: 2, isSelected: false }
      ],
      description: 'string and numbers'
    },
    {
      options: [{ value: 'hello' }, { value: { world: 'world' } }],
      expected: [
        { title: 'undefined', value: 'hello', index: 0, isSelected: false },
        { title: 'undefined', value: { world: 'world' }, index: 1, isSelected: false }
      ],
      description: 'objects'
    },
    {
      options: [NaN, undefined, null, 1, 'a'],
      expected: [
        { title: 'NaN', value: NaN, index: 0, isSelected: false },
        { title: 'undefined', value: undefined, index: 1, isSelected: false },
        { title: 'null', value: null, index: 2, isSelected: false },
        { title: '1', value: 1, index: 3, isSelected: false },
        { title: 'a', value: 'a', index: 4, isSelected: false }
      ],
      description: 'null, undefined, NaN, strings, and numbers'
    }
  ])('updateOptions normalizes $description', ({ options, expected }) => {
    const updatedOptions = updateOptions(options);

    expect(summarizeOptions(updatedOptions)).toEqual(expected);
    updatedOptions.forEach(({ key }) => expect(typeof key).toBe('string'));
  });

  it.each([
    { options: 'a', expected: ['a'], description: 'string' },
    { options: 3, expected: [3], description: 'number' },
    { options: { value: 'hello' }, expected: [{ value: 'hello' }], description: 'object' },
    { options: null, expected: ['null'], description: 'null' },
    { options: undefined, expected: [], description: 'undefined' },
    { options: NaN, expected: ['NaN'], description: 'NaN' },
    { options: ['a', 'b', 3, { value: 'hello' }], expected: ['a', 'b', 3, { value: 'hello' }], description: 'array' },
    {
      options: ['a', 'b', 3, { value: 'hello' }, null, undefined, NaN],
      expected: ['a', 'b', 3, { value: 'hello' }, null, undefined, NaN],
      description: 'array with null, undefined, and NaN'
    }
  ])('updateSelectedOptions normalizes $description', ({ options, expected }) => {
    expect(updateSelectedOptions(options)).toEqual(expected);
  });

  it.each([
    {
      options: ['a', 'b', 3],
      selectedOptions: undefined,
      expected: [],
      description: 'no selection'
    },
    {
      options: ['a', 'b', 3],
      selectedOptions: 'a',
      expected: [{ title: 'a', index: 0 }],
      description: 'string value'
    },
    {
      options: ['a', 'b', 3],
      selectedOptions: 3,
      expected: [{ title: '3', index: 2 }],
      description: 'number value'
    },
    {
      options: ['a', { value: 'lorem ipsum', isSelected: true }, 3],
      selectedOptions: undefined,
      expected: [{ title: 'undefined', index: 1 }],
      description: 'preselected option'
    },
    {
      options: ['a', { value: 'lorem ipsum' }, 3],
      selectedOptions: 'lorem ipsum',
      expected: [{ title: 'undefined', index: 1 }],
      description: 'object value'
    },
    {
      options: ['a', { value: { data: 'lorem ipsum' } }, 3],
      selectedOptions: 'lorem ipsum',
      expected: [{ title: 'undefined', index: 1 }],
      description: 'object value matched by its content'
    },
    {
      options: ['a', { value: 'lorem ipsum', isSelected: true }, { value: 3, isSelected: true }, 'b', 4],
      selectedOptions: undefined,
      variant: 'mock',
      expected: [
        { title: 'undefined', index: 1 },
        { title: 'undefined', index: 2 }
      ],
      description: 'multiple preselected options'
    },
    {
      options: ['a', { value: 'lorem ipsum' }, 3, 'b', 4],
      selectedOptions: [3, 'a', 'lorem ipsum'],
      variant: 'mock',
      expected: [
        { title: 'a', index: 0 },
        { title: 'undefined', index: 1 },
        { title: '3', index: 2 }
      ],
      description: 'multiple values'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: undefined,
      variant: 'mock',
      expected: [],
      description: 'undefined value without a selection'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: 'undefined',
      variant: 'mock',
      expected: [{ title: 'undefined', index: 1 }],
      description: 'undefined value matched by title'
    },
    {
      options: ['a', undefined, 3, 'b', 4],
      selectedOptions: [undefined],
      variant: 'mock',
      expected: [{ title: 'undefined', index: 1 }],
      description: 'undefined value in a selection list'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: null,
      variant: 'mock',
      expected: [{ title: 'null', index: 1 }],
      description: 'null value'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: 'null',
      variant: 'mock',
      expected: [{ title: 'null', index: 1 }],
      description: 'null value matched by title'
    },
    {
      options: ['a', null, 3, 'b', 4],
      selectedOptions: [null],
      variant: 'mock',
      expected: [{ title: 'null', index: 1 }],
      description: 'null value in a selection list'
    },
    {
      options: ['a', '', 3, 'b', 4],
      selectedOptions: '',
      variant: 'mock',
      expected: [{ title: 'Empty', index: 1 }],
      description: 'empty string value'
    },
    {
      options: ['a', '', 3, 'b', 4],
      selectedOptions: [''],
      variant: 'mock',
      expected: [{ title: 'Empty', index: 1 }],
      description: 'empty string in a selection list'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: NaN,
      variant: 'mock',
      expected: [{ title: 'NaN', index: 1 }],
      description: 'NaN value'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: 'NaN',
      variant: 'mock',
      expected: [{ title: 'NaN', index: 1 }],
      description: 'NaN value matched by title'
    },
    {
      options: ['a', NaN, 3, 'b', 4],
      selectedOptions: [NaN],
      variant: 'mock',
      expected: [{ title: 'NaN', index: 1 }],
      description: 'NaN value in a selection list'
    }
  ])(
    'updateSelectedProp selects the expected options for $description',
    ({ options, selectedOptions, variant, expected }) => {
      const selected = normalizeSelectedOptions(
        updateSelectedProp({
          options: updateOptions(options),
          selectedOptions: updateSelectedOptions(selectedOptions),
          variant
        })
      );

      expect(selected.map(({ title, index }) => ({ title, index }))).toEqual(expected);
      expect(selected.every(({ isSelected }) => isSelected)).toBe(true);
    }
  );

  it.each([
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: false },
        { title: 'ipsum', value: 'lorem', index: 'mock', isSelected: true }
      ],
      variant: SelectVariant.single,
      selectedTitles: ['ipsum'],
      selectedIndexes: ['mock'],
      type: 'select-one',
      value: 'lorem',
      description: 'single'
    },
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: true },
        { title: 'ipsum', value: 'ipsum', index: 'mock', isSelected: false }
      ],
      variant: SelectVariant.dropdown,
      selectedTitles: ['lorem'],
      selectedIndexes: ['mock'],
      type: 'select-one',
      value: 'lorem',
      description: 'dropdown'
    },
    {
      options: [
        { title: 'lorem', value: 'lorem', index: 'mock', isSelected: true },
        { title: 'ipsum', value: 'ipsum', index: 'mock', isSelected: true }
      ],
      variant: SelectVariant.checkbox,
      selectedTitles: ['lorem', 'ipsum'],
      selectedIndexes: ['mock', 'mock'],
      type: 'select-multiple',
      value: ['lorem', 'ipsum'],
      description: 'checkbox'
    }
  ])(
    'formatEvent returns selection data for $description',
    ({ options, variant, selectedTitles, selectedIndexes, type, value }) => {
      const formattedEvent = formatEvent({ options, variant });
      const selected = normalizeSelectedOptions(formattedEvent.selected);

      expect(selected.map(({ title }) => title)).toEqual(selectedTitles);
      expect(selected.every(({ isSelected }) => isSelected)).toBe(true);
      expect(formattedEvent.selectedIndex).toEqual(selectedIndexes);
      expect(formattedEvent.type).toBe(type);
      expect(formattedEvent.value).toEqual(value);
    }
  );
});

describe('useOnSelect', () => {
  it('returns an empty option list and a selection callback by default', async () => {
    const { result } = await renderHook(() => useOnSelect({}));

    expect(result.options).toEqual([]);
    expect(result.selectedOption).toBeUndefined();
    expect(result.onSelect).toEqual(expect.any(Function));
  });

  it('does not call the callback for a disabled option', async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() =>
      useOnSelect({ options: ['lorem', { title: 'ipsum', isDisabled: true }], onSelect })
    );
    const disabledOption = result.options.find(({ title }) => title === 'ipsum');

    expect(disabledOption).toEqual(expect.objectContaining({ isDisabled: true, isSelected: false }));
    result.onSelect(undefined, disabledOption.key);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls the callback with the selected option for a single select', async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() => useOnSelect({ options: ['lorem', 'ipsum'], onSelect }));
    const selectedOption = result.options.find(({ value }) => value === 'ipsum');

    result.onSelect(undefined, selectedOption.key);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        selected: expect.objectContaining({ title: 'ipsum', value: 'ipsum', index: 1, isSelected: true }),
        selectedIndex: [1],
        type: 'select-one',
        value: 'ipsum'
      })
    );
  });

  it('calls the callback with selected options for checkboxes', async () => {
    const onSelect = jest.fn();
    const { result } = await renderHook(() =>
      useOnSelect({ options: ['lorem', 'ipsum'], onSelect, variant: SelectVariant.checkbox })
    );
    const selectedOption = result.options.find(({ value }) => value === 'ipsum');

    result.onSelect(undefined, selectedOption.key);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        selected: [expect.objectContaining({ title: 'ipsum', value: 'ipsum', index: 1, isSelected: true })],
        selectedIndex: [1],
        type: 'select-multiple',
        value: ['ipsum']
      })
    );
  });

  it('retains other checkbox selections when toggling choices off and can clear the selection', () => {
    const onSelect = jest.fn();
    // The global renderHook helper returns the initial result; RTL's result.current exposes subsequent state updates.
    const { result } = renderReactHook(() =>
      useOnSelect({
        variant: SelectVariant.checkbox,
        options: [
          { title: 'lorem', value: 'ipsum' },
          { title: 'hello', value: 'world' }
        ],
        onSelect
      })
    );

    expect(result.current.options.map(({ isSelected }) => isSelected)).toEqual([false, false]);

    const selections = [
      { optionIndex: 0, selectedFlags: [true, false], values: ['ipsum'], selectedIndexes: [0] },
      { optionIndex: 1, selectedFlags: [true, true], values: ['ipsum', 'world'], selectedIndexes: [0, 1] },
      { optionIndex: 0, selectedFlags: [false, true], values: ['world'], selectedIndexes: [1] },
      { optionIndex: 1, selectedFlags: [false, false], values: [], selectedIndexes: [] }
    ];

    selections.forEach(({ optionIndex, selectedFlags, values, selectedIndexes }, index) => {
      act(() => result.current.onSelect(undefined, result.current.options[optionIndex].key));

      expect(result.current.options.map(({ isSelected }) => isSelected)).toEqual(selectedFlags);
      expect(onSelect).toHaveBeenCalledTimes(index + 1);
      expect(onSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selected: values.map(value => expect.objectContaining({ value, isSelected: true })),
          selectedIndex: selectedIndexes,
          type: 'select-multiple',
          value: values
        })
      );
    });
  });

  it('keeps the selected title alongside normalized options', async () => {
    const { result } = await renderHook(() => useOnSelect({ options: ['hello', 'world'], selectedOptions: ['hello'] }));

    expect(summarizeOptions(result.options)).toEqual([
      { title: 'hello', value: 'hello', index: 0, isSelected: true },
      { title: 'world', value: 'world', index: 1, isSelected: false }
    ]);
    expect(result.selectedOption).toEqual(
      expect.objectContaining({ title: 'hello', value: 'hello', index: 0, isSelected: true })
    );
  });

  it('preserves selectedOptions when another checkbox option is selected', () => {
    const onSelect = jest.fn();
    const { result } = renderReactHook(() =>
      useOnSelect({
        options: ['hello', 'world'],
        selectedOptions: ['hello'],
        variant: SelectVariant.checkbox,
        onSelect
      })
    );

    expect(result.current.options.map(({ isSelected }) => isSelected)).toEqual([true, false]);

    act(() => result.current.onSelect(undefined, result.current.options[1].key));

    expect(result.current.options.map(({ isSelected }) => isSelected)).toEqual([true, true]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        selected: [
          expect.objectContaining({ title: 'hello', value: 'hello', index: 0, isSelected: true }),
          expect.objectContaining({ title: 'world', value: 'world', index: 1, isSelected: true })
        ],
        selectedIndex: [0, 1],
        type: 'select-multiple',
        value: ['hello', 'world']
      })
    );
  });
});

describe('Select', () => {
  it('renders single-select choices and selected value', () => {
    const props = {
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', key: 'lorem-key', isSelected: false },
          { title: 'hello', value: 'world', key: 'hello-key', isSelected: true }
        ],
        selectedOption: {
          title: 'hello',
          value: 'world',
          isSelected: true
        }
      })
    };

    const component = renderComponent(<Select {...props} />);
    const toggle = component.find('button');

    expect(toggle.textContent.trim()).toBe('hello');
    component.fireEvent.click(toggle);

    const options = component.screen.getAllByRole('option');
    expect(options.map(option => option.textContent.trim())).toEqual(['lorem', 'hello']);
    expect(options.map(option => option.getAttribute('aria-selected'))).toEqual(['false', 'true']);
  });

  it('renders checkbox choices and their selected values', () => {
    const props = {
      variant: SelectVariant.checkbox,
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', key: 'lorem-key', isSelected: false },
          { title: 'hello', value: 'world', key: 'hello-key', isSelected: true }
        ]
      })
    };

    const component = renderComponent(<Select {...props} />);
    const toggle = component.find('button');
    expect(toggle.textContent).toContain('1');

    component.fireEvent.click(toggle);

    expect(component.screen.getByText('lorem')).toBeTruthy();
    expect(component.screen.getByText('hello')).toBeTruthy();
    const checkboxes = getCheckboxInputs(component);

    expect(checkboxes).toHaveLength(2);
    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([false, true]);
  });

  it('renders dropdown choices and passes the selected value to its callback', () => {
    const onSelect = jest.fn();
    const props = {
      variant: SelectVariant.dropdown,
      toggle: { variant: SelectButtonVariant.secondary },
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', key: 'lorem-key' },
          { title: 'hello', value: 'world', key: 'hello-key' }
        ],
        onSelect
      })
    };

    const component = renderComponent(<Select {...props} />);
    const toggle = component.find('button');

    expect(toggle.textContent.trim()).toBe('Select option');
    component.fireEvent.click(toggle);

    const choices = component.screen.getAllByRole('menuitem');
    expect(choices.map(choice => choice.textContent.trim())).toEqual(['lorem', 'hello']);
    component.fireEvent.click(choices[0]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][1]).toBe('lorem-key');
    expect(onSelect.mock.calls[0][0].timeStamp).toBeUndefined();
  });

  it('passes single-select choices and event data to its callback', () => {
    const onSelect = jest.fn();
    const props = {
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', key: 'lorem-key', isSelected: false },
          { title: 'hello', value: 'world', key: 'hello-key', isSelected: true }
        ],
        selectedOption: { title: 'hello', value: 'world', isSelected: true },
        onSelect
      })
    };

    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    component.fireEvent.click(component.screen.getByRole('option', { name: 'lorem' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][1]).toBe('lorem-key');
    expect(onSelect.mock.calls[0][0].type).toBe('click');
    expect(onSelect.mock.calls[0][0].timeStamp).toBeUndefined();
  });

  it('updates the selected title and option state after choosing another value', () => {
    const onSelect = jest.fn();
    const component = renderComponent(
      <Select
        options={[
          { title: 'lorem', value: 'ipsum', isSelected: true },
          { title: 'hello', value: 'world' }
        ]}
        onSelect={onSelect}
      />
    );
    const toggle = component.find('button');

    expect(toggle.textContent.trim()).toBe('lorem');
    component.fireEvent.click(toggle);
    component.fireEvent.click(component.screen.getByRole('option', { name: 'hello' }));

    expect(toggle.textContent.trim()).toBe('hello');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selected: expect.objectContaining({ title: 'hello', value: 'world', index: 1, isSelected: true }),
        selectedIndex: [1],
        type: 'select-one',
        value: 'world'
      })
    );

    component.fireEvent.click(toggle);
    expect(component.screen.getAllByRole('option').map(option => option.getAttribute('aria-selected'))).toEqual([
      'false',
      'true'
    ]);
    component.fireEvent.click(component.screen.getByRole('option', { name: 'lorem' }));

    expect(toggle.textContent.trim()).toBe('lorem');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selected: expect.objectContaining({ title: 'lorem', value: 'ipsum', index: 0, isSelected: true }),
        selectedIndex: [0],
        type: 'select-one',
        value: 'ipsum'
      })
    );

    component.fireEvent.click(toggle);
    expect(component.screen.getAllByRole('option').map(option => option.getAttribute('aria-selected'))).toEqual([
      'true',
      'false'
    ]);
  });

  it('passes checkbox selections to its callback', () => {
    const onSelect = jest.fn();
    const props = {
      variant: SelectVariant.checkbox,
      useOnSelect: () => ({
        options: [
          { title: 'lorem', value: 'ipsum', key: 'lorem-key', isSelected: false },
          { title: 'hello', value: 'world', key: 'hello-key', isSelected: false },
          { title: 'dolor', value: 'sit', key: 'dolor-key', isSelected: true }
        ],
        selectedOption: [],
        onSelect
      })
    };

    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    getCheckboxInputs(component)
      .slice(0, 2)
      .forEach(checkbox => component.fireEvent.click(checkbox));

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect.mock.calls.map(([, value]) => value)).toEqual(['lorem-key', 'hello-key']);
    expect(onSelect.mock.calls.map(([event]) => event.timeStamp)).toEqual([undefined, undefined]);
  });

  it('marks disabled options and ignores their selection', () => {
    const onSelect = jest.fn();
    const component = renderComponent(
      <Select
        options={[
          { title: 'lorem', value: 'lorem' },
          { title: 'ipsum', value: 'ipsum', isDisabled: true }
        ]}
        onSelect={onSelect}
      />
    );

    component.fireEvent.click(component.find('button'));
    const disabledOption = component.screen.getByRole('option', { name: 'ipsum' });

    expect(disabledOption.disabled).toBe(true);
    component.fireEvent.click(disabledOption);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('disables the toggle when options are missing, empty, or explicitly disabled', () => {
    const missingOptions = renderComponent(<Select options={undefined} />);
    const missingOptionsToggle = missingOptions.find('button');
    expect(missingOptionsToggle.disabled).toBe(true);
    missingOptions.fireEvent.click(missingOptionsToggle);
    expect(missingOptionsToggle.getAttribute('aria-expanded')).toBe('false');

    const emptyOptions = renderComponent(<Select options={[]} />);
    expect(emptyOptions.find('button').disabled).toBe(true);

    const disabled = renderComponent(<Select options={['lorem', 'ipsum']} isDisabled />);
    expect(disabled.find('button').disabled).toBe(true);
  });
});
