import graphCardSelectors from '../graphCardSelectors';
import { rhelApiTypes } from '../../../types/rhelApiTypes';

describe('GraphCardSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphCardSelectors).toMatchSnapshot('selectors');
  });

  it('Should error on a RHEL product ID without granularity provided', () => {
    const state = {
      rhelGraph: {
        capacity: {
          fulfilled: true,
          metaQuery: {},
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaQuery: {},
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: no granularity error');
  });

  it('Should handle pending state on a RHEL product ID', () => {
    const state = {
      rhelGraph: {
        capacity: {
          fulfilled: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          pending: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: pending');
  });

  it('Should pass data through on a RHEL product ID when granularity provided mismatches between aggregated responses', () => {
    const state = {
      rhelGraph: {
        capacity: {
          fulfilled: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.MONTHLY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: granularity mismatch fulfilled');
  });

  it('Should map a fulfilled RHEL product ID response to an aggregated output', () => {
    const state = {
      rhelGraph: {
        capacity: {
          fulfilled: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 0,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 0
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 32,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 32,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 3,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 25,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.INSTANCES]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: fulfilled granularity');
  });
});
