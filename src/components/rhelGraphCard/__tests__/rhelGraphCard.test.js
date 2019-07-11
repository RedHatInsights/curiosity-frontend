import React from 'react';
import { mount, shallow } from 'enzyme';
import { RhelGraphCard } from '../rhelGraphCard';
import { helpers } from '../../../common/helpers';

const { breakpoints } = helpers;

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

  it('should render breakpoint states', () => {
    const props = {
      error: false,
      pending: false,
      fulfilled: true,
      breakpoints,
      currentBreakpoint: 'xs'
    };
    const component = shallow(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('xs breakpoint');

    component.setProps({
      currentBreakpoint: 'sm'
    });

    expect(component).toMatchSnapshot('sm breakpoint');

    component.setProps({
      currentBreakpoint: 'md'
    });

    expect(component).toMatchSnapshot('md breakpoint');

    component.setProps({
      currentBreakpoint: 'lg'
    });

    expect(component).toMatchSnapshot('lg breakpoint');

    component.setProps({
      currentBreakpoint: 'xl'
    });

    expect(component).toMatchSnapshot('xl breakpoint');

    component.setProps({
      currentBreakpoint: 'xl2'
    });

    expect(component).toMatchSnapshot('xl2 breakpoint');
  });
});
