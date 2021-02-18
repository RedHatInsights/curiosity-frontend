import _isEqualWith from 'lodash/isEqualWith';
import React from 'react';

/**
 * Compare *, supports function comparison.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
const deepCompareEquals = (a, b) => {
  const customizer = (valueA, valueB) => {
    if (typeof valueA === 'function' && typeof valueB === 'function') {
      return valueA.toString() === valueB.toString();
    }

    return undefined;
  };

  return _isEqualWith(a, b, customizer);
};

/**
 * Expose a ref comparison
 *
 * @param {*} value
 * @returns {*}
 */
const useDeepCompare = value => {
  const ref = React.useRef();

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

/**
 * Expose a deep "useEffect", aimed at object comparisons.
 *
 * @param {Function} callback
 * @param {Array} dependencies
 * @returns {*}
 */
const useDeepCompareEffect = (callback, dependencies) =>
  React.useEffect.call(null, callback, dependencies.map(useDeepCompare));

const contextHelpers = {
  deepCompareEquals,
  useDeepCompare,
  useDeepCompareEffect
};

export { contextHelpers as default, contextHelpers, deepCompareEquals, useDeepCompare, useDeepCompareEffect };
