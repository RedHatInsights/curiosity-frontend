import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @param {object} defaultProps
 * @returns {object}
 */
const statePropsFilter = (state = {}, props, defaultProps = {}) => ({
  graphQuery: {
    ...defaultProps.graphQuery,
    ...state.view?.graphQuery?.[defaultProps.viewId]
  }
});

/**
 * Create selector, transform combined state, props into a consumable API param/query object.
 *
 * @type {{graphQuery: object}}
 */
const selector = createDeepEqualSelector([statePropsFilter], viewGraph => ({
  graphQuery: { ...viewGraph.graphQuery }
}));

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{graphQuery: object}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const viewSelectors = {
  view: selector,
  makeView: makeSelector
};

export { viewSelectors as default, viewSelectors, selector, makeSelector };
