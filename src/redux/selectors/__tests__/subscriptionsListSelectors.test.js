import subscriptionsListSelectors from '../subscriptionsListSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('SubscriptionsListSelectors', () => {
  it('should return specific selectors', () => {
    expect(subscriptionsListSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(subscriptionsListSelectors.subscriptionsList(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass minimal data on a product ID without a product ID provided', () => {
    const props = {
      viewId: 'test',
      productId: undefined,
      query: {}
    };
    const state = {
      inventory: {
        subscriptionsInventory: {
          fulfilled: true,
          metaId: undefined,
          metaQuery: {},
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [] }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(state, props)).toMatchSnapshot('no product id error');
  });

  it('should handle pending state on a product ID', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum ID pending state'
    };
    const state = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum ID pending state': {
            pending: true,
            metaId: 'Lorem Ipsum ID pending state',
            metaQuery: {},
            data: { [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [] }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(state, props)).toMatchSnapshot('pending');
  });

  it('should populate data on a product ID when the api response is missing expected properties', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum missing expected properties',
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
      }
    };
    const state = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum missing expected properties': {
            fulfilled: true,
            metaId: 'Lorem Ipsum missing expected properties',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
            },
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 3
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 3
                }
              ]
            }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(state, props)).toMatchSnapshot(
      'data populated, missing properties'
    );
  });

  it('should map a fulfilled product ID response to an aggregated output', () => {
    const props = {
      viewId: 'test',
      productId: 'Lorem Ipsum fulfilled aggregated output',
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
      }
    };
    const state = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum fulfilled aggregated output': {
            fulfilled: true,
            metaId: 'Lorem Ipsum fulfilled aggregated output',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
            },
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 3
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 3
                }
              ]
            }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(state, props)).toMatchSnapshot('fulfilled');
  });

  it('should populate data from the in memory cache', () => {
    const props = {
      viewId: 'cache-test',
      productId: 'Lorem Ipsum ID cached',
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
      }
    };
    const stateInitialFulfilled = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum ID cached': {
            fulfilled: true,
            metaId: 'Lorem Ipsum ID cached',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.PREMIUM
            },
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 3
                }
              ]
            }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(stateInitialFulfilled, props)).toMatchSnapshot(
      'cached data: initial fulfilled'
    );

    const statePending = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.inventory.subscriptionsInventory['Lorem Ipsum ID cached'],
            pending: true
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(statePending, props)).toMatchSnapshot(
      'cached data: cache used and pending'
    );

    const stateFulfilled = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.inventory.subscriptionsInventory['Lorem Ipsum ID cached'],
            fulfilled: true,
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.PHYSICAL_CAPACITY]: 3,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.VIRTUAL_CAPACITY]: 3,
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.TOTAL_CAPACITY]: 6
                }
              ]
            }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(stateFulfilled, props)).toMatchSnapshot(
      'cached data: updated and fulfilled'
    );

    const stateFulfilledQueryMismatch = {
      inventory: {
        subscriptionsInventory: {
          'Lorem Ipsum ID cached': {
            ...stateInitialFulfilled.inventory.subscriptionsInventory['Lorem Ipsum ID cached'],
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_TYPES.SLA]: rhsmApiTypes.RHSM_API_QUERY_SLA_TYPES.NONE
            }
          }
        }
      }
    };

    expect(subscriptionsListSelectors.subscriptionsList(stateFulfilledQueryMismatch, props)).toMatchSnapshot(
      'cached data: ERROR, query mismatch'
    );
  });
});
