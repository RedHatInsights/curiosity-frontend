import graphCardSelectors from '../graphCardSelectors';
import { rhelApiTypes } from '../../../types/rhelApiTypes';
import { dateHelpers } from '../../../common/dateHelpers';

describe('GraphCardSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphCardSelectors).toMatchSnapshot('selectors');
  });

  it('should error on missing a reducer response', () => {
    const state = {};
    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: missing reducer error');
  });

  it('should error on a RHEL product ID without granularity provided', () => {
    const state = {
      rhelGraph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {},
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {},
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: no granularity error');
  });

  it('should error on a RHEL product ID without a product ID provided', () => {
    const state = {
      rhelGraph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {},
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {},
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: no product id error');
  });

  it('should handle pending state on a RHEL product ID', () => {
    const state = {
      rhelGraph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          pending: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: pending');
  });

  it('should pass data through on a RHEL product ID when granularity provided mismatches between aggregated responses', () => {
    const state = {
      rhelGraph: {
        component: {},
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.MONTHLY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: granularity mismatch fulfilled');

    expect(
      graphCardSelectors.rhelGraphCard({
        rhelGraph: {
          capacity: {
            ...state.rhelGraph.capacity,
            metaQuery: {
              [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
            }
          },
          report: {
            ...state.rhelGraph.report
          }
        }
      })
    ).toMatchSnapshot('rhelGraphCard: granularity mismatch on component');
  });

  it('should populate data on a RHEL product ID when the api response provided mismatches index or date', () => {
    const state = {
      rhelGraph: {
        component: {
          graphGranularity: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: { [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [] }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot(
      'rhelGraphCard: data populated on mismatch fulfilled'
    );
  });

  it('should populate data on a RHEL product ID when the api response is missing expected properties', () => {
    const state = {
      rhelGraph: {
        component: {
          graphGranularity: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 0,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 0,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 0
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 2
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot(
      'rhelGraphCard: data populated, missing properties'
    );
  });

  it('should map a fulfilled RHEL product ID response to an aggregated output', () => {
    const state = {
      rhelGraph: {
        component: {
          graphGranularity: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY,
          ...dateHelpers.getRangedDateTime(rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY)
        },
        capacity: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 0,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 0,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 0
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]: 100,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HYPERVISOR_SOCKETS]: 50,
                [rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.PHYSICAL_SOCKETS]: 50
              }
            ]
          }
        },
        report: {
          fulfilled: true,
          metaData: {
            id: 'Lorem Ipsum'
          },
          metaQuery: {
            [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES.DAILY
          },
          data: {
            [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1
              },
              {
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 2,
                [rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 2
              }
            ]
          }
        }
      }
    };

    expect(graphCardSelectors.rhelGraphCard(state)).toMatchSnapshot('rhelGraphCard: fulfilled granularity');
  });
});
