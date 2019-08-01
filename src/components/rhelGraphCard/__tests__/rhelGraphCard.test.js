import React from 'react';
import { mount, shallow } from 'enzyme';
import { ChartBar } from '@patternfly/react-charts';
import { RhelGraphCard } from '../rhelGraphCard';
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

  it('should set initial width to zero and then resize', () => {
    const component = shallow(<RhelGraphCard />);

    expect(component.instance().onResizeContainer).toBeDefined();

    // initial state width should be zero
    expect(component.state().chartWidth).toEqual(0);

    // set the container size arbitrarily
    component.instance().containerRef.current = { clientWidth: 100 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(100);

    // set the container size arbitrarily and force handleResize to fire
    component.instance().containerRef.current = { clientWidth: 1337 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(1337);
  });

  it('should run componentWillUnmount method successfully', () => {
    const component = mount(<RhelGraphCard />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
