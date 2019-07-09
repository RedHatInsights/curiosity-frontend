import React from 'react';
import { mount, shallow } from 'enzyme';
import { RhelGraphCard } from '../rhelGraphCard';

describe('RhelGraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = mount(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {};

    const component = shallow(<RhelGraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      error: false,
      pending: true
    });

    expect(component).toMatchSnapshot('pending');

    component.setProps({
      error: false,
      pending: false,
      fulfilled: true
    });

    expect(component).toMatchSnapshot('fulfilled');
  });
});
