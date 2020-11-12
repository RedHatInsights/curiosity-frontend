import { createSelector } from 'reselect';
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
  viewId: props.viewId,
  productId: props.productId
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{appMessages: object}}
 */
const selector = createSelector([statePropsFilter], data => {
  const { viewId = null, productId = null } = data || {};
  const appMessages = {};

  const cache = (viewId && productId && selectorCache.data[`${viewId}_${productId}`]) || undefined;

  Object.assign(appMessages, { ...cache });

  return { appMessages };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{appMessages: object}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const appMessagesSelectors = {
  appMessages: selector,
  makeAppMessages: makeSelector
};

export { appMessagesSelectors as default, appMessagesSelectors, selector, makeSelector };
