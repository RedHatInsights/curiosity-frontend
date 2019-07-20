import React from 'react';
import { mount, shallow } from 'enzyme';
import { Chart, ChartBar } from '@patternfly/react-charts';
import { RhelGraphCard } from '../rhelGraphCard';
import { helpers } from '../../../common';
import { rhelApiTypes } from '../../../types/rhelApiTypes';

describe('RhelGraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = mount(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-30T23:59:59Z'),
      graphData: {
        usage: [
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 56,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-01T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 5
          },
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 30,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-08T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 7
          },
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES]: 40,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE]: '2019-06-25T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]: 3
          }
        ]
      }
    };

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
    const { breakpoints } = helpers;
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
