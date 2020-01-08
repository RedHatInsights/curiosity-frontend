import _get from 'lodash/get';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common';

const FULFILLED_ACTION = (base = '') => `${base}_FULFILLED`;

const PENDING_ACTION = (base = '') => `${base}_PENDING`;

const REJECTED_ACTION = (base = '') => `${base}_REJECTED`;

const HTTP_STATUS_RANGE = status => `${status}_STATUS_RANGE`;

const getMessageFromResults = results => {
  const updatedResults = results.payload || results;

  if (helpers.isPromise(updatedResults)) {
    return null;
  }

  const status = _get(updatedResults, 'response.status', updatedResults.status);
  const statusResponse = _get(updatedResults, 'response.statusText', updatedResults.statusText);
  const messageResponse = _get(updatedResults, 'response.message', updatedResults.message);
  const dataResponse = _get(updatedResults, 'response.data', updatedResults.data);
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

const getStatusFromResults = results => {
  const updatedResults = results.payload || results;

  if (helpers.isPromise(updatedResults)) {
    return 0;
  }

  const status = _get(updatedResults, 'response.status', updatedResults.status);

  return status || 0;
};

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

  const baseState = {
    error: false,
    errorMessage: '',
    fulfilled: false,
    metaData: action.meta && action.meta.data,
    metaId: action.meta && action.meta.id,
    metaQuery: action.meta && action.meta.query,
    pending: false,
    update: false
  };

  const setId = data =>
    (action.meta && action.meta.id && { [action.meta.id]: { ...baseState, ...data } }) || { ...baseState, ...data };

  switch (type) {
    case REJECTED_ACTION(whichType.type || whichType):
      return setStateProp(
        whichType.ref || null,
        setId({
          error: true,
          errorMessage: getMessageFromResults(action),
          errorStatus: getStatusFromResults(action)
        }),
        {
          state
        }
      );
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
          date: action.payload.headers && action.payload.headers.date,
          data: (action.payload && action.payload.data) || {},
          fulfilled: true
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
  generatedPromiseActionReducer,
  getMessageFromResults,
  getStatusFromResults,
  setStateProp
};

export { reduxHelpers as default, reduxHelpers };
