import React from 'react';
import { SelectVariant } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { Select, SelectDirection, SelectPosition } from '../select';

describe('Select Component', () => {
  it('should render a basic component', async () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ]
    };

    const component = await mountHookWrapper(<Select {...props} />);
    expect(component.render()).toMatchSnapshot('basic component');
  });

  it('should render a checkbox select', async () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ],
      selectedOptions: ['world', 'ipsum'],
      variant: SelectVariant.checkbox,
      placeholder: 'multiselect test'
    };

    const component = await mountHookWrapper(<Select {...props} />);
    expect(component.render()).toMatchSnapshot('checkbox select');
  });

  it('should allow alternate array and object options', async () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum']
    };

    const component = await mountHookWrapper(<Select {...props} />);

    expect(component.state('options')).toMatchSnapshot('string array');

    component.setProps({
      options: { lorem: 'ipsum', hello: 'world' },
      selectedOptions: ['world', 'ipsum']
    });

    expect(component.state('options')).toMatchSnapshot('key value object');
  });

  it('should allow plain objects as values, and be able to select options based on values within the object', async () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: { dolor: 'sit' } },
        { title: 'dolor', value: { lorem: 'ipsum' } },
        { title: 'hello', value: { hello: 'world' } }
      ],
      selectedOptions: ['world']
    };

    const component = await mountHookWrapper(<Select {...props} />);
    expect(component.state('options')).toMatchSnapshot('select when option values are objects');
  });

  it('should allow selected options to match value or title', async () => {
    const props = {
      id: 'test',
      options: { lorem: 'ipsum', hello: 'world', dolor: 'set' },
      selectedOptions: ['world', 'lorem', 'fail'],
      variant: SelectVariant.checkbox
    };

    const component = await mountHookWrapper(<Select {...props} />);
    expect(component.state('options')).toMatchSnapshot('value or title match');
  });

  it('should return an emulated onchange event', async () => {
    const mockOnSelect = jest.fn();
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum'],
      onSelect: mockOnSelect
    };

    const component = await mountHookWrapper(<Select {...props} />);
    component.instance().onSelect({}, 'hello');
    const {
      currentTarget: helloCurrentTarget,
      options: helloOptions,
      target: helloTarget,
      ...helloRest
    } = mockOnSelect.mock.calls[0][0];
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(helloRest).toMatchSnapshot('default emulated event');

    component.setProps({
      variant: SelectVariant.checkbox
    });

    component.instance().onSelect({}, 'world');
    const {
      currentTarget: worldCurrentTarget,
      options: worldOptions,
      target: worldTarget,
      ...worldRest
    } = mockOnSelect.mock.calls[1][0];
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(worldRest).toMatchSnapshot('checkbox emulated event');
  });

  it('should render an expanded select', async () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = await mountHookWrapper(<Select {...props} />, {
      callback: ({ component: comp }) => {
        comp.find('button').simulate('click');
      }
    });

    expect(component.find('ul.pf-c-select__menu').find('button')).toMatchSnapshot('expanded');
  });

  it('should disable toggle text', async () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      toggleIcon: <FilterIcon />,
      isToggleText: false
    };

    const component = await shallowHookWrapper(<Select {...props} />);
    expect(component.find('.curiosity-select-pf__no-toggle-text').props().className).toMatchSnapshot('disabled text');
  });

  it('should allow alternate direction and position options', async () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      direction: SelectDirection.up
    };

    const component = await shallowHookWrapper(<Select {...props} />);
    const upLeftProps = component.find('.curiosity-select-pf').props();
    expect({
      direction: upLeftProps.direction,
      className: upLeftProps.className
    }).toMatchSnapshot('direction up');

    component.setProps({ direction: SelectDirection.down, position: SelectPosition.right });
    const downRightProps = component.find('.curiosity-select-pf').props();
    expect({
      direction: downRightProps.direction,
      className: downRightProps.className
    }).toMatchSnapshot('position right');
  });

  it('should allow being disabled with missing options', async () => {
    const props = {
      id: 'test',
      options: undefined
    };

    const component = await shallowHookWrapper(<Select {...props} />);
    expect(component).toMatchSnapshot('no options');

    component.setProps({
      options: [],
      isDisabled: false
    });

    expect(component).toMatchSnapshot('options, but no content');

    component.setProps({
      options: ['lorem', 'ipsum', 'hello', 'world'],
      isDisabled: true
    });

    expect(component).toMatchSnapshot('options, but disabled');
  });

  it('should allow data- props', async () => {
    const props = {
      'data-lorem': 'ipsum',
      'data-dolor-sit': 'dolor sit'
    };

    const component = await mountHookWrapper(<Select {...props} />);
    expect(component.props()).toMatchSnapshot('data- attributes');
  });
});
