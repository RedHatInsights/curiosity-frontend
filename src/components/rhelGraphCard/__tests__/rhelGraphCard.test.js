import React from 'react';
import { shallow } from 'enzyme';
import { ChartArea } from '../../chartArea/chartArea';
import { RhelGraphCard } from '../rhelGraphCard';
import { rhelApiTypes } from '../../../types/rhelApiTypes';

describe('RhelGraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-30T23:59:59Z'),
      graphData: {
        usage: [
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 56,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-06-01T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 5
          },
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 30,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-06-08T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 7
          },
          {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 40,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-06-25T00:00:00Z',
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 28,
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 3
          }
        ]
      }
    };

    const component = shallow(<RhelGraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(ChartArea).prop('dataSets')
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
});
