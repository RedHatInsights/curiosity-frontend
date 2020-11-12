import { createSelector } from 'reselect';
import { rhsmApiTypes } from '../../types';
/**
 * Selector cache.
 *
 * @private
 * @type {{data: {object}}}
 */
const selectorCache = { data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  reportCapacity: state.graph?.reportCapacity?.[props.productId],
  viewId: props.viewId,
  productId: props.productId
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{appMessages: {cloudigradeMismatch: boolean}}}
 */
const selector = createSelector([statePropsFilter], data => {
  const { viewId = null, productId = null, reportCapacity = {} } = data || {};
  const appMessages = {
    cloudigradeMismatch: false
  };

  const cache = (viewId && productId && selectorCache.data[`${viewId}_${productId}`]) || undefined;

  Object.assign(appMessages, { ...cache });

  // Scan Tally response for Cloud Meter flags
  if (reportCapacity.fulfilled && appMessages.cloudigradeMismatch !== true) {
    const [{ [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: reportData = [] }] = reportCapacity.data || {};

    const cloudigradeMismatch = reportData.find(
      ({ [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: mismatch }) => mismatch === true
    );

    appMessages.cloudigradeMismatch = cloudigradeMismatch !== undefined;

    selectorCache.data[`${viewId}_${productId}`] = {
      ...appMessages
    };
  }

  return { appMessages };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{appMessages: {cloudigradeMismatch: boolean}}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const appMessagesSelectors = {
  appMessages: selector,
  makeAppMessages: makeSelector
};

export { appMessagesSelectors as default, appMessagesSelectors, selector, makeSelector };
