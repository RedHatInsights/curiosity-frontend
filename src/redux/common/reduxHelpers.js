import _get from 'lodash/get';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common';

/**
 * Apply a "fulfilled" suffix for Redux Promise Middleware action responses.
 *
 * @param {string} base
 * @returns {string}
 */
const FULFILLED_ACTION = (base = '') => `${base}_FULFILLED`;

/**
 * Apply a "pending" suffix for Redux Promise Middleware action responses.
 *
 * @param {string} base
 * @returns {string}
 */
const PENDING_ACTION = (base = '') => `${base}_PENDING`;

/**
 * Apply a "rejected" suffix for Redux Promise Middleware action responses.
 *
 * @param {string} base
 * @returns {string}
 */
const REJECTED_ACTION = (base = '') => `${base}_REJECTED`;

/**
 * Apply a "status range" suffix for Status Middleware action responses.
 *
 * @param {string} status
 * @returns {string}
 */
const HTTP_STATUS_RANGE = status => `${status}_STATUS_RANGE`;

/**
 * Apply a set of schemas using either an array of objects in the
 * form of [{ madeUpKey: 'some_api_key' }], or an array of arrays
 * in the form of [['some_api_key','another_api_key']]
 *
 * @param {Array} schemas
 * @param {*} initialValue
 * @returns {Array}
 */
const setResponseSchemas = (schemas = [], initialValue) =>
  schemas.map(schema => {
    const generated = {};
    const arr = (Array.isArray(schema) && schema) || Object.values(schema);

    arr.forEach(value => {
      generated[value] = initialValue;
    });

    return generated;
  });

/**
 * Create a single response from an array of service call responses.
 * Aids in handling a Promise.all response.
 *
 * @param {Array|object} results
 * @returns {object}
 */
const getSingleResponseFromResultArray = results => {
  const updatedResults =
    (results.payload && results.payload.response) || results.payload || results.response || results;
  const updatedResultsMessage =
    (results.payload && results.payload.message && { message: results.payload.message }) ||
    (results.message && { message: results.message });

  if (Array.isArray(updatedResults)) {
    const firstErrorResponse = updatedResults.find(value => _get(value, 'response.status', value.status) >= 300);
    const firstSuccessResponse = updatedResults.find(value => _get(value, 'response.status', value.status) < 300);

    return (
      (firstErrorResponse && { ...firstErrorResponse, ...updatedResultsMessage }) ||
      (firstSuccessResponse && { ...firstSuccessResponse, ...updatedResultsMessage })
    );
  }

  return { ...updatedResults, ...updatedResultsMessage };
};

/**
 * Get a http status message from a service call.
 *
 * @param {Array|object} results
 * @returns {string|null|*}
 */
const getMessageFromResults = results => {
  const updatedResults = getSingleResponseFromResultArray(results);

  if (helpers.isPromise(updatedResults)) {
    return null;
  }

  const status = updatedResults.status || 0;
  const statusResponse = updatedResults.statusText || '';
  const messageResponse = updatedResults.message;
  const dataResponse = updatedResults.data || null;
  const formattedStatus = (status && `${status} `) || '';

  if (messageResponse && typeof messageResponse === 'string') {
    return messageResponse.trim();
  }

  if (dataResponse && typeof dataResponse === 'string') {
    return `${formattedStatus}${dataResponse}`.trim();
  }

  if (status >= 300 && _isPlainObject(dataResponse)) {
    return `${formattedStatus}${JSON.stringify(dataResponse)}`;
  }

  return (statusResponse && statusResponse.trim()) || null;
};

/**
 * Get a date string from a service call.
 *
 * @param {Array|object} results
 * @returns {null|string|Date}
 */
const getDateFromResults = results => {
  const updatedResults = getSingleResponseFromResultArray(results);

  if (helpers.isPromise(updatedResults)) {
    return null;
  }

  return _get(updatedResults, 'headers.date', null);
};

/**
 * Get a http status from a service call response.
 *
 * @param {Array|object} results
 * @returns {number}
 */
const getStatusFromResults = results => {
  const updatedResults = getSingleResponseFromResultArray(results);

  if (helpers.isPromise(updatedResults)) {
    return 0;
  }

  return updatedResults.status || 0;
};

/**
 * Convenience method for setting object properties, specifically Redux reducer based state objects.
 *
 * @param {string} prop
 * @param {object} data
 * @param {object} options
 * @property {object} state
 * @property {object} initialState
 * @property {boolean} reset
 * @returns {object}
 */
const setStateProp = (prop, data, options) => {
  const { state = {}, initialState = {}, reset = true } = options;
  let obj = { ...state };

  if (process.env.REACT_APP_ENV === 'development' && prop && !state[prop]) {
    console.error(`Error: Property ${prop} does not exist within the passed state.`, state);
  }

  if (process.env.REACT_APP_ENV === 'development' && reset && prop && !initialState[prop]) {
    console.warn(`Warning: Property ${prop} does not exist within the passed initialState.`, initialState);
  }

  if (reset && prop) {
    obj[prop] = {
      ...state[prop],
      ...initialState[prop],
      ...data
    };
  } else if (reset && !prop) {
    obj = {
      ...state,
      ...initialState,
      ...data
    };
  } else if (prop) {
    obj[prop] = {
      ...state[prop],
      ...data
    };
  } else {
    obj = {
      ...state,
      ...data
    };
  }

  return obj;
};

/**
 * Retrieve a data property either from an array of responses, or a single response.
 *
 * @param {Array|object} results
 * @returns {Array|object}
 */
const singlePromiseDataResponseFromArray = results => {
  const updatedResults =
    (results.payload && results.payload.response) || results.payload || results.response || results;

  if (Array.isArray(updatedResults)) {
    return updatedResults.map(value => value.data || {});
  }
  return updatedResults.data || {};
};

/**
 * Alias for singlePromiseDataResponseFromArray.
 *
 * @param {Array|object} results
 * @returns {Array|object}
 */
const getDataFromResults = results => singlePromiseDataResponseFromArray(results);

/**
 * Automatically apply reducer logic to state by handling promise responses from redux-promise-middleware.
 *
 * @param {Array} types
 * @param {object} state
 * @param {object} action
 * @property { string } type
 * @returns {object}
 */
const generatedPromiseActionReducer = (types = [], state = {}, action = {}) => {
  const { type } = action;
  const expandedTypes = [];

  types.forEach(
    val =>
      (Array.isArray(val.type) && val.type.forEach(subVal => expandedTypes.push({ ref: val.ref, type: subVal }))) ||
      expandedTypes.push(val)
  );

  const [whichType] = expandedTypes.filter(val =>
    new RegExp(
      `^(${REJECTED_ACTION(val.type || val)}|${PENDING_ACTION(val.type || val)}|${FULFILLED_ACTION(val.type || val)})$`
    ).test(type)
  );

  if (!whichType) {
    return state;
  }

  const expandMetaTypes = (meta = {}) => {
    const updatedMeta = { ...meta };

    delete updatedMeta.data;
    delete updatedMeta.id;
    delete updatedMeta.query;

    return {
      meta: { ...updatedMeta },
      metaData: meta.data,
      metaId: meta.id,
      metaQuery: meta.query
    };
  };

  const baseState = {
    error: false,
    errorMessage: '',
    fulfilled: false,
    pending: false,
    ...expandMetaTypes(action.meta)
  };

  const setId = data =>
    (action.meta && action.meta.id && { [action.meta.id]: { ...baseState, ...data } }) || { ...baseState, ...data };

  switch (type) {
    case REJECTED_ACTION(whichType.type || whichType):
      const errorMessage = getMessageFromResults(action);
      let errorResponse;

      if (errorMessage === 'cancelled request') {
        errorResponse = {
          date: getDateFromResults(action),
          cancelled: true
        };
      } else {
        errorResponse = {
          error: true,
          errorMessage,
          status: getStatusFromResults(action)
        };
      }

      return setStateProp(whichType.ref || null, setId(errorResponse), {
        state
      });
    case PENDING_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          pending: true
        }),
        {
          state
        }
      );

    case FULFILLED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          date: getDateFromResults(action),
          data: singlePromiseDataResponseFromArray(action),
          fulfilled: true,
          status: getStatusFromResults(action)
        }),
        {
          state
        }
      );

    default:
      return state;
  }
};

const reduxHelpers = {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  HTTP_STATUS_RANGE,
  setResponseSchemas,
  generatedPromiseActionReducer,
  getDataFromResults,
  getDateFromResults,
  getMessageFromResults,
  getSingleResponseFromResultArray,
  getStatusFromResults,
  setStateProp,
  singlePromiseDataResponseFromArray
};

export { reduxHelpers as default, reduxHelpers };
