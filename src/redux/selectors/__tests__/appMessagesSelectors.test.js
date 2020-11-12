import appMessagesSelectors from '../appMessagesSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('AppMessagesSelectors', () => {
  it('should return specific selectors', () => {
    expect(appMessagesSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(appMessagesSelectors.appMessages(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass minimal data on a product ID without a product ID provided', () => {
    const props = {
      viewId: 'test',
      productId: undefined
    };
    const state = {
      graph: {
        reportCapacity: {
          fulfilled: true,
          data: [{ [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [] }]
        }
      }
    };

    expect(appMessagesSelectors.appMessages(state, props)).toMatchSnapshot('no product id error');
  });

  it('should populate data on a product ID when the api response is missing expected properties', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum missing expected properties'
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum missing expected properties': {
            fulfilled: true,
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
              }
            ]
          }
        }
      }
    };

    expect(appMessagesSelectors.appMessages(state, props)).toMatchSnapshot('data populated, missing properties');
  });

  it('should map a fulfilled product ID response to an aggregated output', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum fulfilled aggregated output'
    };
    const state = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum fulfilled aggregated output': {
            fulfilled: true,
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
              }
            ]
          }
        }
      }
    };

    expect(appMessagesSelectors.appMessages(state, props)).toMatchSnapshot('fulfilled');
  });

  it('should populate data from the in memory cache', () => {
    const props = {
      viewId: 'cache-test',
      productId: 'Lorem Ipsum ID cached'
    };
    const stateInitialFulfilled = {
      graph: {
        reportCapacity: {
          'Lorem Ipsum ID cached': {
            fulfilled: true,
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
              }
            ]
          }
        }
      }
    };

    expect(appMessagesSelectors.appMessages(stateInitialFulfilled, props)).toMatchSnapshot(
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

    expect(appMessagesSelectors.appMessages(statePending, props)).toMatchSnapshot(
      'cached data: cache used and pending'
    );

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
                    [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: false
                  }
                ]
              }
            ]
          }
        }
      }
    };

    expect(appMessagesSelectors.appMessages(stateFulfilled, props)).toMatchSnapshot(
      'cached data: update and fulfilled'
    );
  });
});
