import { useSelector as UseSelector, shallowEqual } from 'react-redux';
import { store } from '../store';
import { helpers } from '../../common/helpers';

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
 * @returns {*}
 */
const useSelector = (selector, value = null, options = {}) => {
  if (helpers.TEST_MODE) {
    return value;
  }

  return UseSelector(selector, options.equality) ?? value;
};

const reactReduxHooks = {
  shallowEqual,
  useDispatch,
  useSelector
};

export { reactReduxHooks as default, reactReduxHooks, shallowEqual, useDispatch, useSelector };
