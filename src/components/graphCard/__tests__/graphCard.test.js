import React from 'react';
import { shallow } from 'enzyme';
import { Chart } from '../../chart/chart';
import { GraphCard } from '../graphCard';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';

describe('GraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      },
      productId: 'lorem'
    };
    const component = shallow(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2019-06-26T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2019-05-25T00:00:00.000Z'
      },
      productId: 'lorem',
      graphData: {
        physicalSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ]
      }
    };

    const component = shallow(<GraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(Chart).prop('dataSets')
    }).toMatchSnapshot('error passes values');

    component.setProps({
      status: 403
    });

    expect(component).toMatchSnapshot('error with 403 status');

    component.setProps({
      status: 500
    });

    expect(component).toMatchSnapshot('error with 500 status');

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

  it('should filter result sets', () => {
    const props = {
      filterGraphData: [
        {
          id: 'loremIpsumSockets'
        },
        {
          id: 'thresholdLoremIpsumSockets'
        }
      ],
      query: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2019-06-26T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2019-05-25T00:00:00.000Z'
      },
      productId: 'lorem',
      graphData: {
        loremIpsumSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ],
        dolorSitSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ],
        thresholdLoremIpsumSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ]
      }
    };

    const component = shallow(<GraphCard {...props} />);

    expect(component.find(Chart).prop('dataSets')).toMatchSnapshot('filtered dataSets');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      },
      isDisabled: true,
      productId: 'lorem'
    };
    const component = shallow(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should allow a custom display for card actions', () => {
    const actionDisplay = jest.fn();
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      },
      productId: 'lorem',
      settings: { actionDisplay }
    };

    shallow(<GraphCard {...props} />);
    expect(actionDisplay).toHaveBeenCalledTimes(1);
  });
});
