import React from 'react';
import { shallow } from 'enzyme';
import { GraphCard } from '../graphCard.deprecated';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';

describe('GraphCard Component', () => {
  it('should render a non-connected component', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      })
    };
    const component = await mountHookComponent(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', async () => {
    const props = {
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
      },
      useProduct: () => ({ productId: 'lorem' }),
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      })
    };
    const component = await shallowHookComponent(<GraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect(component).toMatchSnapshot('error state');

    component.setProps({
      error: false,
      pending: true
    });

    expect(component).toMatchSnapshot('pending state');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      isDisabled: true,
      useProduct: () => ({ productId: 'lorem' }),
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      })
    };
    const component = shallow(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should allow a custom display for card actions', async () => {
    const actionDisplay = jest.fn();
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductGraphConfig: () => ({
        settings: {
          actionDisplay
        }
      }),
      useProductGraphTallyQuery: () => ({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-24T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2021-01-25T00:00:00.000Z'
      })
    };

    shallow(<GraphCard {...props} />);
    expect(actionDisplay).toHaveBeenCalledTimes(1);
  });
});
