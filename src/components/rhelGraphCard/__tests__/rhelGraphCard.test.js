import React from 'react';
import { mount } from 'enzyme';
import { RhelGraphCard } from '../rhelGraphCard';

describe('RhelGraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = mount(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });
});
