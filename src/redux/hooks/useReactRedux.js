/* eslint-disable no-unsafe-optional-chaining */
import { useSelector as useReactReduxSelector, shallowEqual } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import { store } from '../store';
import { helpers } from '../../common';

/**
 * State hooks and helpers for dispatch and selectors.
 *
 * @memberof Hooks
 * @module UseReactRedux
 */

/**
 * Create a simple selector. Groups selector function arguments into a single memoized result function for
 * use as a Redux selector.
 *
 * @param {Function|Array<Function>} selectors
 * @param {Function} callback
 * @returns {Function}
 */
const createSimpleSelector = (selectors, callback) => {
  const updatedSelectors = (Array.isArray(selectors) && selectors) || [selectors];

  // eslint-disable-next-line prefer-spread
  const result = helpers.memo((...resultArgs) => callback.apply(null, resultArgs));

  // eslint-disable-next-line func-names
  const selector = function (...args) {
    const results = [];
    updatedSelectors.forEach(sel => {
      results.push(sel.apply(this, args));
    });
    return result.apply(this, results);
  };

  return helpers.memo(selector);
};

/**
 * Deep equal comparison with extended memoized cache. Is argument A equal to argument B.
 *
 * @param {object} args
 * @param {object|any} args.A
 * @param {object|any} args.B
 * @returns {boolean}
 */
const deepEqual = helpers.memo((...args) => _isEqual(...args), { cacheLimit: 50 });

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
 * @param {Array|Function} selectors A selector function or array of functions. Or an array of objects in the form of
 *     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the
 *     form of an object whose properties reflect said IDs with the associated selector value.
 * @param {*} value Pass-through value similar to charging the response.
 * @param {object} options
 * @param {Function} options.useSelector
 * @param {*} options.equality
 * @returns {Array|object}
 */
const useSelectors = (
  selectors,
  value,
  { equality = deepEqual, useSelector: useAliasSelector = useReactReduxSelector } = {}
) => {
  let updatedSelectors = Array.isArray(selectors) ? selectors : [selectors];
  const selectorIds = new Set();

  updatedSelectors = updatedSelectors.map(selector => {
    if (selector.selector && selector.id) {
      selectorIds.add(selector.id);
      return selector.selector;
    }
    return selector;
  });

  const multiSelector = createSimpleSelector(updatedSelectors, (...results) => results);
  let listMultiSelectorResponse = (useAliasSelector(multiSelector, equality) ?? value) || [];
  const undefinedMultiSelectorResponse = listMultiSelectorResponse.filter(response => response === undefined);

  if (undefinedMultiSelectorResponse.length === listMultiSelectorResponse.length) {
    listMultiSelectorResponse = [];
  } else {
    listMultiSelectorResponse = _cloneDeep(listMultiSelectorResponse);
  }

  if (selectorIds.size && selectorIds.size === listMultiSelectorResponse.length) {
    const idMultiSelectorResponse = {};

    Array.from(selectorIds).forEach((id, index) => {
      idMultiSelectorResponse[id] = listMultiSelectorResponse[index];
    });

    return idMultiSelectorResponse;
  }

  return listMultiSelectorResponse;
};

/**
 * Return a combined selector response using a "Promise.all" like response.
 *
 * @param {Array|Function} selectors A selector function or array of functions. Or an array of objects in the form of
 *     { selector: Function, id: string } If an "ID" is used for each selector the returned response will be in the
 *     form of an object whose properties reflect said IDs with the associated selector value.
 * @param {object} options
 * @param {Function} options.useSelectors
 * @param {Function} options.customResponse Callback for customizing your own response
 * @returns {{data: ({}|Array), pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsResponse = (selectors, { useSelectors: useAliasSelectors = useSelectors, customResponse } = {}) => {
  const selectorResponse = useAliasSelectors(selectors, []);
  const isSelectorResponseArray = Array.isArray(selectorResponse);

  const cancelledById = {};
  const cancelledByList = [];
  const cancelledDataById = {};
  const cancelledDataByList = [];

  const errorByList = [];
  const errorById = {};
  const errorDataById = {};
  const errorDataByList = [];

  const fulfilledByList = [];
  const fulfilledById = {};
  const fulfilledDataById = {};
  const fulfilledDataByList = [];

  const pendingByList = [];

  const responsesById = {};
  const responsesByList = [];
  const dataById = {};
  const dataByList = [];

  const idList = [];

  const updatedSelectorResponse = _cloneDeep(
    (isSelectorResponseArray && selectorResponse) || Object.entries(selectorResponse)
  );

  updatedSelectorResponse.forEach(response => {
    const id = (!isSelectorResponseArray && response?.[0]) || null;

    const updatedResponse = (isSelectorResponseArray && response) || response?.[1] || response;
    const isServiceResponse =
      typeof updatedResponse.cancelled === 'boolean' ||
      typeof updatedResponse.error === 'boolean' ||
      typeof updatedResponse.fulfilled === 'boolean' ||
      typeof updatedResponse.pending === 'boolean';

    const { pending, fulfilled, error, cancelled, message } = (isServiceResponse && updatedResponse) || {};

    if (id !== null) {
      idList.push(id);
      updatedResponse.id = id;
    }

    if (cancelled) {
      cancelledByList.push(updatedResponse);
      cancelledDataByList.push(updatedResponse?.data || updatedResponse);

      if (id !== null) {
        cancelledById[id] = cancelledByList[cancelledByList.length - 1];
        cancelledDataById[id] =
          cancelledByList[cancelledByList.length - 1]?.data || cancelledByList[cancelledByList.length - 1];
      }
    }

    if (error) {
      errorByList.push({
        ...updatedResponse,
        ...new Error(message || `Error: useSelectorsAllResponse${(id && `, ${id}`) || ''}`)
      });
      errorDataByList.push(updatedResponse?.data || updatedResponse);

      if (id !== null) {
        errorById[id] = errorByList[errorByList.length - 1];
        errorDataById[id] = errorByList[errorByList.length - 1]?.data || errorByList[errorByList.length - 1];
      }
    }

    if (fulfilled) {
      fulfilledByList.push(updatedResponse);
      fulfilledDataByList.push(updatedResponse?.data || updatedResponse);

      if (id !== null) {
        fulfilledById[id] = fulfilledByList[fulfilledByList.length - 1];
        fulfilledDataById[id] =
          fulfilledByList[fulfilledByList.length - 1]?.data || fulfilledByList[fulfilledByList.length - 1];
      }
    }

    if (pending) {
      pendingByList.push(updatedResponse);
    }

    if (id !== null) {
      responsesById[id] = updatedResponse;
      dataById[id] = updatedResponse?.data || updatedResponse;
    }

    responsesByList.push(updatedResponse);
    dataByList.push(updatedResponse?.data || updatedResponse);
  });

  const isById = idList.length !== 0 && idList.length === updatedSelectorResponse.length;

  const response = {
    responses: {
      id: responsesById,
      list: responsesByList
    },
    cancelled: false,
    data: (isById && {}) || [],
    error: false,
    fulfilled: false,
    message: null,
    pending: false
  };

  if (typeof customResponse === 'function') {
    Object.assign(response, {
      ...customResponse(
        { ...response, responses: { ...response.responses } },
        {
          cancelledById,
          cancelledByList,
          cancelledDataById,
          cancelledDataByList,
          dataById,
          dataByList,
          errorByList,
          errorById,
          errorDataById,
          errorDataByList,
          fulfilledByList,
          fulfilledById,
          fulfilledDataById,
          fulfilledDataByList,
          idList,
          isById,
          pendingByList,
          responsesByList,
          responsesById,
          updatedSelectorResponse
        }
      )
    });

    return response;
  }

  if (errorByList.length) {
    response.message = new Error(
      `useSelectorsResponse, aggregated response error:\n${JSON.stringify(
        errorByList.map(({ message, errorMessage }) => `${message || errorMessage}`),
        null,
        2
      )}`,
      {
        cause: errorByList
      }
    );
    response.error = true;
    response.data = (isById && errorDataById) || errorDataByList;
    return response;
  }

  if (pendingByList.length) {
    response.pending = true;
    return response;
  }

  if (cancelledByList.length && cancelledByList.length === responsesByList.length) {
    response.message = new Error('Cancelled useSelectorsResponse');
    response.cancelled = true;
    response.data = (isById && cancelledById) || cancelledByList;
    return response;
  }

  if (
    fulfilledByList.length &&
    (fulfilledByList.length === responsesByList.length ||
      cancelledByList.length + fulfilledByList.length === responsesByList.length)
  ) {
    response.fulfilled = true;
    response.data = (isById && dataById) || dataByList;
    return response;
  }

  return response;
};

/**
 * Return a combined selector response using a "Promise.allSettled" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|Array), pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsAllSettledResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (
    baseResponse,
    { cancelledByList, errorByList, fulfilledByList, pendingByList, dataById, dataByList, isById }
  ) => {
    const response = { ...baseResponse };

    if (pendingByList?.length) {
      response.pending = true;
      return response;
    }

    if (
      errorByList?.length + fulfilledByList?.length + cancelledByList?.length === dataByList?.length ||
      errorByList?.length === dataByList?.length ||
      fulfilledByList?.length === dataByList?.length ||
      cancelledByList?.length === dataByList?.length
    ) {
      response.fulfilled = true;
      response.data = (isById && dataById) || dataByList;
      return response;
    }

    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

/**
 * Return a combined selector response using a "Promise.any" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|Array), pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsAnyResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (
    baseResponse,
    {
      cancelledByList,
      cancelledDataById,
      cancelledDataByList,
      errorByList,
      errorDataById,
      errorDataByList,
      fulfilledByList,
      fulfilledDataById,
      fulfilledDataByList,
      pendingByList,
      responsesByList,
      isById
    }
  ) => {
    const response = { ...baseResponse };

    if (fulfilledByList?.length) {
      let data = fulfilledDataByList?.[0];

      if (isById) {
        const keyList = Object.keys(fulfilledDataById);
        data = (keyList?.[0] && fulfilledDataById[keyList[0]]) || undefined;
      }

      response.fulfilled = true;
      response.data = data;
      return response;
    }

    if (pendingByList?.length) {
      response.pending = true;
      return response;
    }

    if (
      errorByList?.length &&
      (errorByList?.length === responsesByList?.length ||
        cancelledByList?.length + errorByList?.length === responsesByList?.length)
    ) {
      response.message = helpers.aggregatedError(errorByList, 'useSelectorsAnyResponse');
      response.error = true;
      response.data = (isById && errorDataById) || errorDataByList;
      return response;
    }

    if (cancelledByList?.length && cancelledByList?.length === responsesByList?.length) {
      response.message = new Error('Cancelled useSelectorsAnyResponse');
      response.cancelled = true;
      response.data = (isById && cancelledDataById) || cancelledDataByList;
      return response;
    }

    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

/**
 * Return a combined selector response using a "Promise.race" like response.
 *
 * @param {Array|Function} selectors
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: ({}|Array), pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, error: boolean, message: null}}
 */
const useSelectorsRaceResponse = (
  selectors,
  { useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => {
  const customResponse = (
    baseResponse,
    {
      cancelledByList,
      cancelledDataById,
      cancelledDataByList,
      errorByList,
      errorDataById,
      errorDataByList,
      fulfilledByList,
      fulfilledDataById,
      fulfilledDataByList,
      pendingByList,
      responsesByList,
      isById
    }
  ) => {
    const response = { ...baseResponse };

    if (fulfilledByList?.length) {
      let data = fulfilledDataByList?.[0];

      if (isById) {
        const keyList = Object.keys(fulfilledDataById);
        data = (keyList?.[0] && fulfilledDataById[keyList[0]]) || undefined;
      }

      response.fulfilled = true;
      response.data = data;
      return response;
    }

    if (errorByList?.length) {
      let data = errorDataByList?.[0];

      if (isById) {
        const keyList = Object.keys(errorDataById);
        data = (keyList?.[0] && errorDataById[keyList[0]]) || undefined;
      }

      response.message = new Error(
        errorByList[0]?.message || `useSelectorsRaceResponse, ${JSON.stringify(errorByList[0])}`
      );
      response.error = true;
      response.data = data;
      return response;
    }

    if (pendingByList?.length) {
      response.pending = true;
      return response;
    }

    if (cancelledByList?.length && cancelledByList?.length === responsesByList?.length) {
      let data = cancelledDataByList?.[0];

      if (isById) {
        const keyList = Object.keys(cancelledDataById);
        data = (keyList?.[0] && cancelledDataById[keyList[0]]) || undefined;
      }

      response.message = new Error('Cancelled useSelectorsRaceResponse');
      response.cancelled = true;
      response.data = data;
      return response;
    }

    return response;
  };

  return useAliasSelectorsResponse(selectors, { customResponse });
};

const reactReduxHooks = {
  createSimpleSelector,
  deepEqual,
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse,
  useSelectorsAllSettledResponse,
  useSelectorsAnyResponse,
  useSelectorsRaceResponse
};

export {
  reactReduxHooks as default,
  reactReduxHooks,
  createSimpleSelector,
  deepEqual,
  shallowEqual,
  useDispatch,
  useSelector,
  useSelectors,
  useSelectorsResponse,
  useSelectorsAllSettledResponse,
  useSelectorsAnyResponse,
  useSelectorsRaceResponse
};
