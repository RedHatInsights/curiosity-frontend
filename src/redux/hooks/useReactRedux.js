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

const reactReduxHooks = {
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors
};

export { reactReduxHooks as default, reactReduxHooks, shallowEqual, useDispatch, useSelector, useSelectors };
