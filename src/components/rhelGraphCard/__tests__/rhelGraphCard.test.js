import React from 'react';
import { mount, shallow } from 'enzyme';
import { Chart, ChartBar } from '@patternfly/react-charts';
import { RhelGraphCard } from '../rhelGraphCard';
import { helpers } from '../../../common/helpers';

describe('RhelGraphCard Component', () => {
  const { breakpoints } = helpers;

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

  it('should have specific breakpoint styles based on state', () => {
    const props = {
      error: false,
      pending: false,
      fulfilled: true,
      breakpoints,
      currentBreakpoint: 'xs'
    };
    const component = shallow(<RhelGraphCard {...props} />);

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('xs breakpoint');

    component.setProps({
      currentBreakpoint: 'sm'
    });

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('sm breakpoint');

    component.setProps({
      currentBreakpoint: 'md'
    });

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('md breakpoint');

    component.setProps({
      currentBreakpoint: 'lg'
    });

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('lg breakpoint');

    component.setProps({
      currentBreakpoint: 'xl'
    });

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('xl breakpoint');

    component.setProps({
      currentBreakpoint: 'xl2'
    });

    expect({
      chartHeight: component.find(Chart).prop('height'),
      chartBarLabelComponentHeight: component.find(ChartBar).prop('labelComponent').props.height,
      chartBarLabelComponentStyle: component.find(ChartBar).prop('labelComponent').props.style
    }).toMatchSnapshot('xl2 breakpoint');
  });
});
