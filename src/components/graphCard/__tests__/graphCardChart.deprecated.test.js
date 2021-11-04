import React from 'react';
import { shallow } from 'enzyme';
import { GraphCardChart } from '../graphCardChart.deprecated';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';
import { Chart } from '../../chart/chart';

describe('GraphCardChart Component', () => {
  it('should render a basic component', () => {
    const props = {
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
      })
    };
    const component = shallow(<GraphCardChart {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should filter result sets', async () => {
    const props = {
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
      },
      useProductGraphConfig: () => ({
        filters: [
          {
            id: 'loremIpsumSockets'
          },
          {
            id: 'thresholdLoremIpsumSockets'
          }
        ]
      }),
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
      })
    };
    const component = await shallowHookComponent(<GraphCardChart {...props} />);

    expect(component.find(Chart).prop('dataSets')).toMatchSnapshot('filtered dataSets');
  });
});
