import graphCardSelectors from '../graphCardSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('GraphCardSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphCardSelectors).toMatchSnapshot('selectors');
  });

  it('should error on missing a reducer response', () => {
    const state = {};
    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: missing reducer error');
  });

  it('should error on a product ID without granularity provided', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum ID missing granularity'
    };
    const state = {
      graph: {
        component: {},
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

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('rhelGraphCard: no granularity error');
  });

  it('should error on a product ID without a product ID provided', () => {
    const props = {
      viewId: 'test',
      productId: undefined
    };
    const state = {
      graph: {
        component: {},
        reportCapacity: {
          fulfilled: true,
          metaId: undefined,
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: [
            { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] },
            { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
          ]
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('rhelGraphCard: no product id error');
  });

  it('should handle pending state on a product ID', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum ID pending state'
    };
    const state = {
      graph: {
        component: {
          test: {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum ID pending state': {
            pending: true,
            metaId: 'Lorem Ipsum ID pending state',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            },
            data: [
              { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] },
              { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('rhelGraphCard: pending');
  });

  it('should populate data on a product ID when the api response provided mismatches index or date', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum mismatched index or date'
    };
    const state = {
      graph: {
        component: {
          test: {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum mismatched index or date': {
            fulfilled: true,
            metaId: 'Lorem Ipsum mismatched index or date',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
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

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot(
      'rhelGraphCard: data populated on mismatch fulfilled'
    );
  });

  it('should populate data on a product ID when the api response is missing expected properties', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum missing expected properties'
    };
    const state = {
      graph: {
        component: {
          test: {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum missing expected properties': {
            fulfilled: true,
            metaId: 'Lorem Ipsum missing expected properties',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
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

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot(
      'rhelGraphCard: data populated, missing properties'
    );
  });

  it('should map a fulfilled product ID response to an aggregated output', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum fulfilled aggregated output'
    };
    const state = {
      graph: {
        component: {
          test: {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum fulfilled aggregated output': {
            fulfilled: true,
            metaId: 'Lorem Ipsum fulfilled aggregated output',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
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
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
                  },
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 4,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 2,
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 2,
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

    expect(graphCardSelectors.graphCard(state, props)).toMatchSnapshot('rhelGraphCard: fulfilled granularity');
  });

  it('should populate data from the in memory cache', () => {
    const props = {
      viewId: 'cache-test',
      productId: 'Lorem Ipsum ID cached'
    };
    const stateDailyGranularityFulfilled = {
      graph: {
        component: {
          'cache-test': {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            fulfilled: true,
            metaId: 'Lorem Ipsum ID cached',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
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
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
                  {
                    [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
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

    graphCardSelectors.graphCard(stateDailyGranularityFulfilled, props);

    const stateDailyGranularityPending = {
      graph: {
        ...stateDailyGranularityFulfilled.graph.component,
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateDailyGranularityFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            pending: true
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyGranularityPending, props)).toMatchSnapshot(
      'granularity cached data: cached data'
    );

    const stateDailyComponentCapacityGranularity = {
      graph: {
        component: {
          'cache-test': {
            graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          }
        },
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateDailyGranularityFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            fulfilled: true
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyComponentCapacityGranularity, props)).toMatchSnapshot(
      'granularity cached data: component and reportCapacity match'
    );

    const stateDailyReportCapacityGranularityMismatch = {
      graph: {
        component: {},
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            ...stateDailyGranularityFulfilled.graph.reportCapacity['Lorem Ipsum ID cached'],
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.WEEKLY
            }
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyReportCapacityGranularityMismatch, props)).toMatchSnapshot(
      'granularity cached data: ERROR, no component reportCapacity mismatch'
    );
  });
});
