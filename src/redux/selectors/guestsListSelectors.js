import { createSelector } from 'reselect';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { selector as userSession } from './userSelectors';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.hostsGuests?.[props.id]
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{listData: Array, pending: boolean, fulfilled: boolean, error: boolean, status: (*|number)}}
 */
const selector = createSelector([statePropsFilter], response => {
  const { metaId, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    listData: [],
    status: responseData.status
  };

  if (responseData.fulfilled) {
    const { [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: listData = [] } = responseData.data || {};

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.LAST_SEEN:
          return (value && new Date(value)) || null;
        default:
          return value ?? null;
      }
    };

    // Generate normalized properties
    const [updatedListData] = reduxHelpers.setNormalizedResponse({
      schema: rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
      data: listData,
      customResponseValue: customInventoryValue
    });

    // Update response and cache
    updatedResponseData.fulfilled = true;
    updatedResponseData.listData = updatedListData;
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{listData: Array, pending: boolean, fulfilled: boolean, error: boolean, session: object,
 *     status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...userSession(state, props, defaultProps),
  ...selector(state, props, defaultProps)
});

const guestsListSelectors = {
  guestsList: selector,
  makeGuestsList: makeSelector
};

export { guestsListSelectors as default, guestsListSelectors, selector, makeSelector };
