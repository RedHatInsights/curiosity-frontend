import { createSelectorCreator, defaultMemoize } from 'reselect';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

const viewGraphQuery = (state = {}, props, defaultProps = {}) => ({
  graphQuery: {
    ...defaultProps.graphQuery,
    ..._get(state, ['view', 'graphQuery'])
  }
});

const viewSelector = createDeepEqualSelector([viewGraphQuery], viewGraph => ({
  graphQuery: { ...viewGraph.graphQuery }
}));

const makeViewSelector = defaultProps => (state, props) => ({
  ...viewSelector(state, props, defaultProps)
});

const viewSelectors = {
  view: viewSelector,
  makeView: makeViewSelector
};

export { viewSelectors as default, viewSelectors, viewSelector, makeViewSelector };
