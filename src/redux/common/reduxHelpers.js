import _get from 'lodash/get';
import _join from 'lodash/join';
import _map from 'lodash/map';

const FULFILLED_ACTION = (base = '') => `${base}_FULFILLED`;

const PENDING_ACTION = (base = '') => `${base}_PENDING`;

const REJECTED_ACTION = (base = '') => `${base}_REJECTED`;

const getMessageFromResults = (results, filterField = null) => {
  const status = _get(results, 'response.status', results.status);
  const statusResponse = _get(results, 'response.statusText', results.statusText);
  const messageResponse = _get(results, 'response.data', results.message);
  const detailResponse = _get(results, 'response.data', results.detail);

  let serverStatus = '';

  if (!messageResponse && !detailResponse) {
    if (status < 400) {
      return statusResponse;
    }

    if (status >= 500 || status === undefined) {
      return `${status || ''} Server is currently unable to handle this request.`;
    }
  }

  if (status >= 500 || status === undefined) {
    serverStatus = status ? `${status} ` : '';
  }

  if (typeof messageResponse === 'string') {
    return `${serverStatus}${messageResponse}`;
  }

  if (typeof detailResponse === 'string') {
    return `${serverStatus}${detailResponse}`;
  }

  const getMessages = (messageObject, filterKey) => {
    const obj = filterKey ? messageObject[filterKey] : messageObject;

    return _map(
      obj,
      next => {
        if (Array.isArray(next)) {
          return getMessages(next);
        }

        return next;
      },
      null
    );
  };

  return `${serverStatus}${_join(getMessages(messageResponse || detailResponse, filterField), '\n')}`;
};

const getStatusFromResults = results => {
  let status = _get(results, 'response.status', results.status);

  if (status === undefined) {
    status = 0;
  }

  return status;
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

const reduxHelpers = {
  FULFILLED_ACTION,
  PENDING_ACTION,
  REJECTED_ACTION,
  getMessageFromResults,
  getStatusFromResults,
  setStateProp
};

export { reduxHelpers as default, reduxHelpers };
