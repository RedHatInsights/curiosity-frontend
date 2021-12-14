import { useSelector as useReactReduxSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { store } from '../store';

/**
 * FixMe: Appears to be an issue in trying to use Redux Promise with the default "useDispatch"
 */
/**
 * Wrapper for store.dispatch, emulating useDispatch.
 *
 * @returns {Function}
 */
const useDispatch = () => dispatchEvent => store.dispatch(dispatchEvent);

/**
 * Wrapper for Redux hook, useSelector. Applies test mode and a fallback value.
 *
 * @param {Function} selector
 * @param {*} value
 * @param {object} options
 * @param {*} options.equality
 * @param {Function} options.useSelector
 * @returns {*}
 */
const useSelector = (
  selector,
  value = null,
  { equality, useSelector: useAliasSelector = useReactReduxSelector } = {}
) => useAliasSelector(selector, equality) ?? value;

/**
 * Generate a selector from multiple selectors for use in "useSelector".
 *
 * @param {Array} selectors
 * @param {*} value
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {*} options.equality
 * @returns {Array}
 */
const useSelectors = (
  selectors,
  value,
  { equality = shallowEqual, useSelector: useAliasSelector = useReactReduxSelector } = {}
) => {
  const multiSelector = createSelector(selectors, (...results) => results);
  return useAliasSelector(multiSelector, equality) ?? value;
};

/**
 * Return a combined selector response from an API.
 *
 * @param {Array|Function} selectors A Redux state selector function, or array of functions.
 * @param {object} options
 * @param {Function} options.useSelectors
 * @returns {object}
 */
const useSelectorsResponse = (selectors, { useSelectors: useAliasSelectors = useSelectors } = {}) => {
  const updatedSelectors = Array.isArray(selectors) ? selectors : [selectors];
  const selectorResponse = useAliasSelectors(updatedSelectors, []);

  const updatedData = [];
  let isPending = false;
  let isFulfilled = false;
  let errorCount = 0;
  let cancelCount = 0;

  const parsedSelectorResponse = selectorResponse.map(response => {
    const { pending, fulfilled, error, cancelled, data } = response || {};

    if (pending) {
      isPending = true;
    }

    if (fulfilled) {
      isFulfilled = true;
      updatedData.push(data);
    }

    if (error) {
      errorCount += 1;
    }

    if (cancelled) {
      cancelCount += 1;
    }

    return response;
  });

  const response = {
    data: updatedData,
    cancelled: false,
    error: false,
    fulfilled: false,
    pending: false
  };

  if (cancelCount === parsedSelectorResponse.length) {
    response.cancelled = true;
  } else if (
    errorCount === parsedSelectorResponse.length ||
    cancelCount + errorCount === parsedSelectorResponse.length
  ) {
    response.error = true;
  } else if (isPending) {
    response.pending = true;
  } else if (isFulfilled) {
    response.fulfilled = true;
  }

  return response;
};

const reactReduxHooks = {
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse
};

export {
  reactReduxHooks as default,
  reactReduxHooks,
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse
};
