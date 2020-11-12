import graphCardSelectors from '../graphCardSelectors';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  rhsmApiTypes
} from '../../../types/rhsmApiTypes';

describe('GraphCardSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphCardSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass minimal data on a product ID without granularity provided', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum ID missing granularity'
    };
    const state = {
      graph: {
        reportCapacity: {
          fulfilled: true,
          metaId: 'Lorem Ipsum ID missing granularity',
          metaQuery: {},
          data: [
            { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] },
            { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
          ]
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('no granularity error');
  });

  it('should pass minimal data on a product ID without a product ID provided', () => {
    const props = {
      viewId: 'test',
      productId: undefined,
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const state = {
      graph: {
        reportCapacity: {
          fulfilled: true,
          metaId: undefined,
          metaQuery: {
            [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: [
            { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] },
            { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
          ]
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('no product id error');
  });

  it('should handle pending state on a product ID', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum ID pending state',
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID pending state': {
            pending: true,
            metaId: 'Lorem Ipsum ID pending state',
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] },
              { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('pending');
  });

  it('should populate data on a product ID when the api response provided mismatches index or date', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum mismatched index or date',
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum mismatched index or date': {
            fulfilled: true,
            metaId: 'Lorem Ipsum mismatched index or date',
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
                  }
                ]
              },
              { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('data populated on mismatch fulfilled');
  });

  it('should populate data on a product ID when the api response is missing expected properties', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum missing expected properties',
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum missing expected properties': {
            fulfilled: true,
            metaId: 'Lorem Ipsum missing expected properties',
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 2
                  }
                ]
              },
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 0,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 0,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 0
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
                  }
                ]
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('data populated, missing properties');
  });

  it('should map a fulfilled product ID response to an aggregated output', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum fulfilled aggregated output',
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum fulfilled aggregated output': {
            fulfilled: true,
            metaId: 'Lorem Ipsum fulfilled aggregated output',
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 4,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: null,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                  }
                ]
              },
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]: false
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 0,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 0,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 0,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]: true
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: null,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]: true
                  }
                ]
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('fulfilled');
  });

  it('should populate data from the in memory cache', () => {
    const props = {
      viewId: 'cache-test',
      productId: 'Lorem Ipsum ID cached',
      query: { [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY }
    };
    const stateInitialFulfilled = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            fulfilled: true,
            metaId: 'Lorem Ipsum ID cached',
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                  }
                ]
              },
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]: false
                  }
                ]
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateInitialFulfilled, props)).toMatchSnapshot(
      'cached data: initial fulfilled'
    );

    const statePending = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            pending: true
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(statePending, props)).toMatchSnapshot('cached data: cache used and pending');

    const stateFulfilled = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            fulfilled: true,
            data: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2018-07-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                  }
                ]
              },
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2018-07-04T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50,
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]: false
                  }
                ]
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateFulfilled, props)).toMatchSnapshot('cached data: update and fulfilled');

    const stateFulfilledQueryMismatch = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            metaQuery: {
              [RHSM_API_QUERY_TYPES.GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.WEEKLY
            }
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateFulfilledQueryMismatch, props)).toMatchSnapshot(
      'cached data: ERROR, query mismatch'
    );
  });
});
