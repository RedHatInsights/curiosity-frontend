import guestsListSelectors from '../guestsListSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('GuestsListSelectors', () => {
  it('should return specific selectors', () => {
    expect(guestsListSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(guestsListSelectors.guestsList(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass minimal data on an ID without an ID provided', () => {
    const props = {
      id: undefined
    };
    const state = {
      inventory: {
        hostsGuests: {
          fulfilled: true,
          metaId: undefined,
          metaQuery: {},
          data: { [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [] }
        }
      }
    };

    expect(guestsListSelectors.guestsList(state, props)).toMatchSnapshot('no id error');
  });

  it('should handle pending state on an ID', () => {
    const props = {
      id: 'Lorem Ipsum ID pending state'
    };
    const state = {
      inventory: {
        hostsGuests: {
          'Lorem Ipsum ID pending state': {
            pending: true,
            metaId: 'Lorem Ipsum ID pending state',
            metaQuery: {},
            data: { [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [] }
          }
        }
      }
    };

    expect(guestsListSelectors.guestsList(state, props)).toMatchSnapshot('pending');
  });

  it('should populate data on an ID when the api response is missing expected properties', () => {
    const props = {
      id: 'Lorem Ipsum missing expected properties'
    };
    const state = {
      inventory: {
        hostsGuests: {
          'Lorem Ipsum missing expected properties': {
            fulfilled: true,
            metaId: 'Lorem Ipsum missing expected properties',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 10,
              [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 0
            },
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.ID]:
                    'd6214a0b-b344-4778-831c-d53dcacb2da3',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.SUBSCRIPTION_ID]:
                    'adafd9d5-5b00-42fa-a6c9-75801d45cc6d'
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.ID]:
                    '9358e312-1c9f-42f4-8910-dcef6e970852',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.NAME]: 'db.example.com',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.LAST_SEEN]: '2019-09-04T00:00:00.000Z'
                }
              ]
            }
          }
        }
      }
    };

    expect(guestsListSelectors.guestsList(state, props)).toMatchSnapshot('data populated, missing properties');
  });

  it('should map a fulfilled ID response to an aggregated output', () => {
    const props = {
      id: 'Lorem Ipsum fulfilled aggregated output'
    };
    const state = {
      inventory: {
        hostsGuests: {
          'Lorem Ipsum fulfilled aggregated output': {
            fulfilled: true,
            metaId: 'Lorem Ipsum fulfilled aggregated output',
            metaQuery: {
              [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 10,
              [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 0
            },
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.ID]:
                    'd6214a0b-b344-4778-831c-d53dcacb2da3',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.NAME]: 'db.lorem.com',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.SUBSCRIPTION_ID]:
                    'adafd9d5-5b00-42fa-a6c9-75801d45cc6d',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.LAST_SEEN]: '2019-07-03T00:00:00.000Z'
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.ID]:
                    '9358e312-1c9f-42f4-8910-dcef6e970852',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.NAME]: 'db.ipsum.com',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.SUBSCRIPTION_ID]:
                    'b101a72f-1859-4489-acb8-d6d31c2578c4',
                  [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES.LAST_SEEN]: '2019-09-04T00:00:00.000Z'
                }
              ]
            }
          }
        }
      }
    };

    expect(guestsListSelectors.guestsList(state, props)).toMatchSnapshot('fulfilled');
  });
});
