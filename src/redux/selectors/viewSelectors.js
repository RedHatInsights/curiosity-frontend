import { createSelectorCreator, defaultMemoize } from 'reselect';
import _get from 'lodash/get';
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
const viewGraphQuery = (state = {}, props, defaultProps = {}) => ({
  graphQuery: {
    ...defaultProps.graphQuery,
    ..._get(state, ['view', 'graphQuery'])
  }
});

/**
 * Create selector, transform combined state, props into a consumable API param/query object.
 *
 * @type {{graphQuery: object}}
 */
const viewSelector = createDeepEqualSelector([viewGraphQuery], viewGraph => ({
  graphQuery: { ...viewGraph.graphQuery }
}));

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{graphQuery: object}}
 */
const makeViewSelector = defaultProps => (state, props) => ({
  ...viewSelector(state, props, defaultProps)
});

const viewSelectors = {
  view: viewSelector,
  makeView: makeViewSelector
};

export { viewSelectors as default, viewSelectors, viewSelector, makeViewSelector };
