import graphCardSelectors from '../graphCardSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';
import { dateHelpers } from '../../../common/dateHelpers';

describe('GraphCardSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphCardSelectors).toMatchSnapshot('selectors');
  });

  it('should error on missing a reducer response', () => {
    const state = {};
    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: missing reducer error');
  });

  it('should error on a product ID without granularity provided', () => {
    const state = {
      graph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum ID missing granularity'
          },
          metaQuery: {},
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum ID missing granularity'
          },
          metaQuery: {},
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: no granularity error');
  });

  it('should error on a product ID without a product ID provided', () => {
    const state = {
      graph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {},
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {},
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: no product id error');
  });

  it('should handle pending state on a product ID', () => {
    const state = {
      graph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum ID pending state'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          pending: true,
          metaData: {
            id: 'Lorem Ipsum ID pending state'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: pending');
  });

  it('should pass data through on a product ID when granularity provided mismatches between aggregated responses', () => {
    const state = {
      graph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum mismatched granularity'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.MONTHLY
          },
          data: {
            [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum mismatched granularity'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: granularity mismatch on API fulfilled');

    expect(
      graphCardSelectors.graphCard({
        graph: {
          capacity: {
            ...state.graph.capacity,
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            }
          },
          report: {
            ...state.graph.report
          }
        }
      })
    ).toMatchSnapshot('rhelGraphCard: granularity mismatch on API');
  });

  it('should populate data on a product ID when the api response provided mismatches index or date', () => {
    const state = {
      graph: {
        component: {
          graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum mismatched index or date'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum mismatched index or date'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: data populated on mismatch fulfilled');
  });

  it('should populate data on a product ID when the api response is missing expected properties', () => {
    const state = {
      graph: {
        component: {
          graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum missing expected properties'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum missing expected properties'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: data populated, missing properties');
  });

  it('should map a fulfilled product ID response to an aggregated output', () => {
    const state = {
      graph: {
        component: {
          graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum fulfilled aggregated output'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum fulfilled aggregated output'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
          }
        }
      }
    };

    expect(graphCardSelectors.graphCard(state)).toMatchSnapshot('rhelGraphCard: fulfilled granularity');
  });

  it('should populate data from the in memory cache', () => {
    const stateDailyGranularityFulfilled = {
      graph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum ID cached'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum ID cached'
          },
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
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
          }
        }
      }
    };

    graphCardSelectors.graphCard(stateDailyGranularityFulfilled);

    const stateDailyGranularityPending = {
      graph: {
        component: {},
        capacity: {
          ...stateDailyGranularityFulfilled.graph.capacity,
          pending: true
        },
        report: {
          ...stateDailyGranularityFulfilled.graph.report,
          pending: true
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyGranularityPending)).toMatchSnapshot(
      'granularity cached data: cached data'
    );

    const stateDailyComponentCapacityGranularity = {
      component: {
        graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
      },
      graph: {
        component: {},
        capacity: {
          ...stateDailyGranularityFulfilled.graph.capacity,
          fulfilled: true
        },
        report: {
          ...stateDailyGranularityFulfilled.graph.report,
          pending: true
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyComponentCapacityGranularity)).toMatchSnapshot(
      'granularity cached data: component and capacity match'
    );

    const stateDailyComponentReportGranularity = {
      component: {
        graphGranularity: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
      },
      graph: {
        component: {},
        capacity: {
          ...stateDailyGranularityFulfilled.graph.capacity,
          pending: true
        },
        report: {
          ...stateDailyGranularityFulfilled.graph.report,
          fulfilled: true
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyComponentReportGranularity)).toMatchSnapshot(
      'granularity cached data: component and report match'
    );

    const stateDailyReportCapacityGranularityMismatch = {
      component: {},
      graph: {
        component: {},
        capacity: {
          ...stateDailyGranularityFulfilled.graph.capacity,
          metaQuery: {
            [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: rhsmApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.WEEKLY
          }
        },
        report: {
          ...stateDailyGranularityFulfilled.graph.report
        }
      }
    };

    expect(graphCardSelectors.graphCard(stateDailyReportCapacityGranularityMismatch)).toMatchSnapshot(
      'granularity cached data: ERROR, no component, report and capacity mismatch'
    );
  });
});
