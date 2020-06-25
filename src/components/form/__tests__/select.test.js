import React from 'react';
import { mount } from 'enzyme';
import { SelectVariant } from '@patternfly/react-core';
import Select from '../select';

describe('Select Component', () => {
  it('should render a basic component', () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ]
    };

    const component = mount(<Select {...props} />);
    expect(component.render()).toMatchSnapshot('basic dropdown');
  });

  it('should render a checkbox select', () => {
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

    const component = mount(<Select {...props} />);
    expect(component.render()).toMatchSnapshot('checkbox select');
  });

  it('should allow a alternate array and object options', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum']
    };

    const component = mount(<Select {...props} />);

    expect(component.render()).toMatchSnapshot('string array');

    component.setProps({
      options: { lorem: 'ipsum', hello: 'world' },
      selectedOptions: ['world', 'ipsum']
    });

    expect(component.render()).toMatchSnapshot('key value object');
  });

  it('should allow selected options to match value or title', () => {
    const props = {
      id: 'test',
      options: { lorem: 'ipsum', hello: 'world', dolor: 'set' },
      selectedOptions: ['world', 'lorem', 'fail'],
      variant: SelectVariant.checkbox
    };

    const component = mount(<Select {...props} />);
    expect(component.render()).toMatchSnapshot('value or title match');
  });

  it('should return an emulated onchange event', done => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum']
    };

    props.onSelect = event => {
      expect(event).toMatchSnapshot('emulated event');
      done();
    };

    const component = mount(<Select {...props} />);
    component.instance().onSelect({}, 'hello');

    component.setProps({
      variant: SelectVariant.checkbox
    });

    component.instance().onSelect({}, 'world');
  });

  it('should render a expanded select', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = mount(<Select {...props} />);
    component.find('button').simulate('click');

    expect(component).toMatchSnapshot('expanded');
  });
});
