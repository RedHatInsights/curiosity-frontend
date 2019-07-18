import React from 'react';
import { mount, shallow } from 'enzyme';
import { Chart, ChartBar } from '@patternfly/react-charts';
import { RhelGraphCard } from '../rhelGraphCard';
import { helpers } from '../../../common';

describe('RhelGraphCard Component', () => {
  const { breakpoints } = helpers;
  const startDate = new Date('2019-06-01T00:00:00Z');
  const endDate = new Date('2019-06-30T00:00:00Z');

  it('should render a non-connected component', () => {
    const props = { startDate, endDate };

    const component = mount(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = { startDate, endDate };

    const component = shallow(<RhelGraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(ChartBar).prop('data')
    }).toMatchSnapshot('error shows zeroed bar values');

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
      currentBreakpoint: 'xs',
      startDate,
      endDate
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
